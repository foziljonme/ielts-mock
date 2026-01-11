import { Controller, Get } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { AccessRoles } from 'src/auth/decorators/access-roles.decorator';
import { UserRole } from 'prisma/generated/enums';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import type { JwtPayloadBase } from 'src/auth/entities/token.entity';

@Controller('tenant')
@AccessRoles(UserRole.TENANT_ADMIN, UserRole.STAFF)
export class TenantController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('/current')
  async getCurrentTenant(@GetCurrentUser() user: JwtPayloadBase) {
    const tenantId = user.tenantId;
    return await this.tenantsService.get(tenantId);
  }
}
