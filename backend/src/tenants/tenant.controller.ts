import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { AccessRoles } from 'src/auth/decorators/access-roles.decorator';
import { UserRole } from 'prisma/generated/enums';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import type { JwtPayloadBase } from 'src/auth/entities/token.entity';

@Controller('tenant')
@UseGuards(JwtAuthGuard)
@AccessRoles(UserRole.TENANT, UserRole.STAFF)
export class TenantController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('/dashboard')
  async getDashboard(@GetCurrentUser() user: JwtPayloadBase) {
    const tenantId = user.tenantId;
    return await this.tenantsService.getDashboard(tenantId);
  }
}
