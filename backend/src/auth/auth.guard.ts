import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  type LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  ContextEnvKeys,
  ContextStorageService,
  ContextStorageServiceKey,
} from 'src/config/contextStorage.service';
import {
  ACCESS_ROLES_KEY,
  RequiredRoles,
} from './decorators/access-roles.decorator';
import { JwtPayload } from './entities/token.entity';
import { UserRole } from 'prisma/generated/enums';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private jwtService: JwtService,
    private reflector: Reflector,
    @Inject(ContextStorageServiceKey)
    private readonly contextStorageService: ContextStorageService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('Authenticating...');
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.log('No token found, rejecting request');
      throw new UnauthorizedException();
    }

    let payload: any;

    try {
      this.logger.log('Verifying token...');
      payload = await this.jwtService.verifyAsync(token);
      this.logger.log({ message: 'Token verified successfully', payload });
    } catch (error) {
      this.logger.log({ message: 'Invalid token, rejecting request', error });
      throw new UnauthorizedException(
        'Token verification failed, please make sure you are using a valid token',
      );
    }

    // 💡 We're assigning the payload to the request object here
    // so that we can access it in our route handlers
    request['user'] = payload;

    // Saas admins have access to all tenants
    // no need to check permissions
    const isSaasAdmin = this.isSaasAdmin(payload);
    const isPlatformRequest = this.contextStorageService.isPlatformRequest;

    if (
      !(isSaasAdmin || isPlatformRequest) &&
      this.contextStorageService.tenantId !== payload.tenantId
    ) {
      this.logger.log('Tenant ID mismatch, rejecting request');
      throw new UnauthorizedException('Tenant ID mismatch');
    }

    const requiredRoles = this.reflector.getAllAndOverride<RequiredRoles>(
      ACCESS_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles && !this.isRoleMatch(payload, requiredRoles)) {
      this.logger.log({
        message: 'Role mismatch, rejecting request',
        role: payload.role,
        requiredRoles,
      });
      throw new UnauthorizedException(
        `You do not have access to this resource. Required role(s): ${requiredRoles.filter((role) => role !== UserRole.OWNER).join(', ')}`,
      );
    }

    this.logger.log('Authentication successful');
    this.contextStorageService.setContextEnv(
      ContextEnvKeys.IS_OWNER,
      isSaasAdmin,
    );

    this.contextStorageService.setContextEnv(
      ContextEnvKeys.IS_PLATFORM_REQUEST,
      isPlatformRequest,
    );
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isRoleMatch(payload: JwtPayload, requiredRoles: RequiredRoles) {
    const userRoles = payload.roles;
    return requiredRoles.some((role) => userRoles.includes(role as UserRole));
  }

  private isSaasAdmin(payload: JwtPayload) {
    return payload.roles.includes(UserRole.OWNER);
  }
}
