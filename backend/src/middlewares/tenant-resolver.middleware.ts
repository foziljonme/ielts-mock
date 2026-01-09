// This reads reqeust host, gets subdomain from it and validates it against the database and sets it to the request

import {
  Inject,
  Injectable,
  NestMiddleware,
  NotFoundException,
  type LoggerService,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  ContextEnvKeys,
  ContextStorageService,
  ContextStorageServiceKey,
} from 'src/config/contextStorage.service';
import { TenantsService } from 'src/tenants/tenants.service';

@Injectable()
export class TenantResolverMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly tenantService: TenantsService,
    @Inject(ContextStorageServiceKey)
    private readonly contextStorageService: ContextStorageService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // System routes does not have tenant
    console.log(req.originalUrl);
    // if (
    //   req.originalUrl.startsWith('/platform') ||
    //   req.originalUrl === '/auth/login-platform-admin'
    // ) {
    //   this.contextStorageService.setContextEnv(
    //     ContextEnvKeys.IS_PLATFORM_REQUEST,
    //     true,
    //   );
    //   next();
    //   return;
    // }
    const subdomain = this.extractSubdomain(req);
    if (!subdomain) {
      this.logger.log('No subdomain found');
      next();
      return;
    }
    const tenant = await this.tenantService.getBySubdomain(subdomain);

    if (!tenant) {
      this.logger.error(`Tenant with subdomain ${subdomain} not found`);
      // throw new NotFoundException('Tenant not found');
      next();
      return;
    }

    req['tenantId'] = tenant.id;
    this.logger.log('Setting tenant id', tenant.id);

    this.contextStorageService.setContextEnv(
      ContextEnvKeys.TENANT_ID,
      tenant.id,
    );

    this.contextStorageService.setContextEnv(
      ContextEnvKeys.SUBDOMAIN,
      subdomain,
    );

    this.logger.log(
      `Tenant with id ${tenant.id} and subdomain ${subdomain} found`,
    );
    next();
  }

  private extractSubdomain(req: Request): string {
    const subdomain = req.headers['x-tenant'];
    // if (!subdomain || Array.isArray(subdomain)) {
    //   this.logger.error('No subdomain found, or invalid subdomain');
    //   throw new NotFoundException('Tenant not found, or invalid subdomain');
    // }

    return subdomain as string;

    // const host = req.headers.host;
    // const subdomain = host?.split('.')[0];
    // if (!subdomain) {
    //   this.logger.error('No subdomain found');
    //   throw new NotFoundException('Tenant not found');
    // }
    // return subdomain;
  }
}
