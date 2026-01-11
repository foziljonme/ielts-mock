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
import { LoginDto, CandidateLoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AccessRoles } from './decorators/access-roles.decorator';
import { Public } from './decorators/public.decorator';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import type { JwtPayloadBase } from './entities/token.entity';
import { UserRole } from 'prisma/generated/enums';

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

  @Post('admin/login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    this.logger.log({ message: 'Logging in user' });
    return await this.authService.login(loginDto);
  }

  @Get('admin/me')
  @AccessRoles(UserRole.STAFF, UserRole.TENANT_ADMIN)
  async getMe(@GetCurrentUser() user: JwtPayloadBase) {
    this.logger.log({ message: 'Getting user', userId: user.sub });
    return this.authService.getAdminMe(user.sub);
  }

  @Post('candidate/login')
  @Public()
  async candidateLogin(@Body() body: CandidateLoginDto) {
    this.logger.log({ message: 'Logging in candidate' });
    return await this.authService.candidateLogin(body);
  }

  @Get('candidate/me')
  @AccessRoles(UserRole.CANDIDATE)
  async getCandidateMe(@GetCurrentUser() user: JwtPayloadBase) {
    this.logger.log({ message: 'Getting user', userId: user.sub });
    return this.authService.getCandidateMe(user.sub);
  }

  @Post('login-platform-admin')
  @Public()
  async platformLogin(@Body() loginDto: LoginDto) {
    this.logger.log({ message: 'Logging in platform admin' });
    return await this.authService.login(loginDto, true);
  }
}
