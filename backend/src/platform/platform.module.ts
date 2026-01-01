import { Module } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { TenantsModule } from './tenants/tenants.module';
import { TenantsService } from './tenants/tenants.service';
import { PlatformController } from './platform.controller';
import { UsersModule } from './users/users.module';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users/users.service';

@Module({
  providers: [PlatformService, TenantsService, AuthService, UsersService],
  imports: [TenantsModule, UsersModule],
  exports: [PlatformService, TenantsService],
  controllers: [PlatformController],
})
export class PlatformModule {}
