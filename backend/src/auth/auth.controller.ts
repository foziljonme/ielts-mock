import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
  type LoggerService,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/platform/users/dto/create-user.dto';
import { type AuthRequest } from 'src/common/request.type';
import { AuthGuard } from './auth.guard';
import { AccessRoles } from './decorators/access-roles.decorator';
import { UserRole } from 'prisma/generated/enums';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
  ) {}

  // @Post('register')
  // async register(@Body() registerDto: CreateUserDto) {
  //   this.logger.log({ message: 'Registering user', registerDto });
  //   return this.authService.register(registerDto);
  // }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log({ message: 'Logging in user', loginDto });
    return this.authService.login(loginDto);
  }

  @Post('login-platform-admin')
  async platformLogin(@Body() loginDto: LoginDto) {
    this.logger.log({ message: 'Logging in platform admin' });
    return await this.authService.login(loginDto, true);
  }

  @Get('me')
  @AccessRoles(UserRole.OWNER, UserRole.TENANT)
  @UseGuards(AuthGuard)
  async getMe(@Req() req: AuthRequest) {
    this.logger.log({ message: 'Getting user', userId: req.user.id });
    return this.authService.getMe(req);
  }
}
