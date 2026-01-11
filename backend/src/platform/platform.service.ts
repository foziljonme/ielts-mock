import { Inject, Injectable, type LoggerService } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constants';
import { UserRole } from 'prisma/generated/enums';

@Injectable()
export class PlatformService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async seedPlatformAdminAccounts() {
    this.logger.log('Seeding platform admin accounts...');
    const result: any[] = [];
    const adminCredentials = this.configService
      .get('SYSTEM_ADMIN_CREDS_FOR_SEED')
      ?.split(',');
    for (const admin of adminCredentials) {
      const [email, password] = admin.split(':');
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      result.push(
        this.prismaService.user.upsert({
          where: { email },
          update: {
            password: hashedPassword,
            roles: [UserRole.PLATFORM_ADMIN],
          },
          create: {
            email,
            password: hashedPassword,
            roles: [UserRole.PLATFORM_ADMIN],
            name: 'Platform Admin',
          },
        }),
      );
    }

    return Promise.all(result);
  }

  // create(createAdminDto: CreateAdminDto) {
  //   return 'This action adds a new admin';
  // }

  // listAll() {
  //   return `This action returns all admin`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} admin`;
  // }

  // update(id: number, updateAdminDto: UpdateAdminDto) {
  //   return `This action updates a #${id} admin`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} admin`;
  // }
}
