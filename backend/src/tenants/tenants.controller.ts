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
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { AccessRoles } from 'src/auth/decorators/access-roles.decorator';
import { UserRole } from 'prisma/generated/enums';
import { SearchTenantDto } from './dto/search-tenant.dto';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import type { JwtPayloadBase } from 'src/auth/entities/token.entity';

@Controller('platform/tenants')
@UseGuards(JwtAuthGuard)
@AccessRoles(UserRole.PLATFORM_ADMIN)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  async create(@Body() createTenantDto: CreateTenantDto) {
    return await this.tenantsService.create(createTenantDto);
  }

  @Get()
  async listAll(@Query() query: SearchTenantDto) {
    return await this.tenantsService.listAll(query);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.tenantsService.get(id);
  }

  // @Get('current-tenant')
  // async getCurrentTenant(@GetCurrentUser() user: JwtPayloadBase) {
  //   return await this.tenantsService.getCurrentTenant(user.tenantId);
  // }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    return await this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.tenantsService.delete(id);
  }

  @Post(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    return await this.tenantsService.deactivate(id);
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string) {
    return await this.tenantsService.activate(id);
  }
}
