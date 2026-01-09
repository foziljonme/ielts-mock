import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  type LoggerService,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoginDto, JoinByCodeDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AccessRoles } from './decorators/access-roles.decorator';
import { UserRole } from 'prisma/generated/enums';
import { Public } from './decorators/public.decorator';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import type {
  JwtPayloadBase,
  SessionJwtPayload,
} from './entities/token.entity';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  @Public()
  async register(@Body() registerDto: CreateUserDto) {
    this.logger.log({ message: 'Registering user' });
    return this.authService.register(registerDto, registerDto.roles);
  }

  @Post('/join-by-code')
  @Public()
  async joinByCode(@Body() body: JoinByCodeDto) {
    this.logger.log({ message: 'Logging in user' });
    return await this.authService.joinByCode(body);
  }

  @Get('session')
  @AccessRoles(UserRole.STUDENT, UserRole.TENANT, UserRole.STAFF)
  async getSessionInfo(@GetCurrentUser() user: JwtPayloadBase) {
    this.logger.log({ message: 'Getting session info', user });
    return await this.authService.getSessionInfo(user);
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    this.logger.log({ message: 'Logging in user' });
    return await this.authService.login(loginDto);
  }

  @Post('login-platform-admin')
  @Public()
  async platformLogin(@Body() loginDto: LoginDto) {
    this.logger.log({ message: 'Logging in platform admin' });
    return await this.authService.login(loginDto, true);
  }

  @Get('me')
  @AccessRoles(UserRole.OWNER, UserRole.TENANT)
  async getMe(@GetCurrentUser() user: JwtPayloadBase) {
    this.logger.log({ message: 'Getting user', userId: user.sub });
    return this.authService.getMe(user.sub);
  }
}
