import {
  Inject,
  Injectable,
  UnauthorizedException,
  type LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './entities/login.entity';
import { TOKEN_EXPIRES_IN } from 'src/common/constants';
import { UsersService } from 'src/platform/users/users.service';
import { CreateUserDto } from 'src/platform/users/dto/create-user.dto';
import { AuthRequest } from 'src/common/request.type';
import {
  ContextStorageService,
  ContextStorageServiceKey,
} from 'src/config/contextStorage.service';
import { JwtPayload } from './entities/token.entity';
import { UserRole } from 'prisma/generated/enums';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @Inject(ContextStorageServiceKey)
    private readonly contextStorageService: ContextStorageService,
  ) {}

  async register(registerDto: CreateUserDto) {
    this.logger.log('Registering user');
    const user = await this.usersService.createWithTx(registerDto);

    this.logger.log({ message: 'User registered', user });

    return user;
  }

  async login(loginDto: LoginDto, isPlatformAdmin = false) {
    this.logger.log('Logging in user');

    const { email, password } = loginDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'User not found, please make sure you are using the correct email and tenant',
      );
    }

    if (isPlatformAdmin) {
      if (!user.roles.includes(UserRole.OWNER)) {
        throw new UnauthorizedException(
          'User is not a platform admin, please make sure you are using the correct email',
        );
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.error({
        message: 'Invalid password',
      });
      throw new UnauthorizedException(
        'Invalid password, please make sure you are using the correct password',
      );
    }

    const { accessToken, refreshToken } = this.signTokens({
      id: user.id,
      tenantId: user.tenantId,
      roles: user.roles,
    });

    this.logger.log('Login successful');

    return {
      accessToken,
      refreshToken,
      exp: new Date().getTime() + TOKEN_EXPIRES_IN * 1000,
    };
  }

  private signTokens(data: JwtPayload) {
    const accessToken = this.jwtService.sign(data);
    const refreshToken = this.jwtService.sign(data, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  public async getMe(req: AuthRequest) {
    const userId = req.user.id;

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, tenant, ...rest } = user;

    return {
      ...rest,
    };
  }
}
