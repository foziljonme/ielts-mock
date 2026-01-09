// src/auth/guards/jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  type LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { JwtService } from '@nestjs/jwt';
// import {
//   ContextStorageService,
//   ContextStorageServiceKey,
// } from 'src/config/contextStorage.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private jwtService: JwtService,
    private reflector: Reflector,
    // @Inject(ContextStorageServiceKey)
    // private readonly contextStorageService: ContextStorageService,
  ) {}

  async canActivate(context: ExecutionContext) {
    this.logger.log('Checking if route is marked Public');
    // Check if route is marked @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.log('Route is marked Public, allowing access');
      return true;
    }

    this.logger.log('Route is not marked Public, checking for token');
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    try {
      this.logger.log('Token found, verifying');
      const user = await this.jwtService.verifyAsync(token);
      request.user = user;
      this.logger.log({ message: 'Token verified, allowing access' });
      return true;
    } catch (error) {
      this.logger.error({ message: 'Token verification failed', error });
      throw new UnauthorizedException('Invalid or missing token');
    }
  }

  private extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    if (!token || type !== 'Bearer') {
      this.logger.error({ message: 'Invalid or missing token' });
      throw new UnauthorizedException('Invalid or missing token');
    }

    return token;
  }
}
