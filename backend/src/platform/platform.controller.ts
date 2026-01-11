import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { TenantsService } from '../tenants/tenants.service';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('')
// @UseGuards(AuthGuard)
export class PlatformController {
  constructor(
    private readonly PlatformService: PlatformService,
    private readonly tenantsService: TenantsService,
    private readonly authService: AuthService,
  ) {}

  @Post('seed-platform-admin-accounts')
  @Public()
  async seedPlatformAdminAccounts() {
    return await this.PlatformService.seedPlatformAdminAccounts();
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto, true);
  }

  // @Post('tenants')
  // async createTenant(@Body() createTenantDto: CreateTenantDto) {
  //   return await this.tenantsService.create(createTenantDto);
  // }

  // @Get('tenants')
  // async listAllTenants() {
  //   return await this.tenantsService.listAll();
  // }

  // @Get('tenants/:id')
  // async getTenant(@Param('id') id: string) {
  //   return await this.tenantsService.get(id);
  // }

  // @Patch('tenants/:id')
  // async updateTenant(
  //   @Param('id') id: string,
  //   @Body() updateTenantDto: UpdateTenantDto,
  // ) {
  //   return await this.tenantsService.update(id, updateTenantDto);
  // }

  // @Delete('tenants/:id')
  // async deleteTenant(@Param('id') id: string) {
  //   return await this.tenantsService.delete(id);
  // }

  // @Post()
  // create(@Body() createAdminDto: CreateAdminDto) {
  //   return this.PlatformService.create(createAdminDto);
  // }

  // @Get()
  // listAll() {
  //   return this.PlatformService.listAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.PlatformService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
  //   return this.PlatformService.update(+id, updateAdminDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.PlatformService.remove(+id);
  // }
}
