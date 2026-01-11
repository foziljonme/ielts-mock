import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  type LoggerService,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constants';
import { SearchDto } from './dto/search.dto';
import { Prisma, PrismaClient, UserRole } from 'prisma/generated/client';
import {
  ContextStorageService,
  ContextStorageServiceKey,
} from 'src/config/contextStorage.service';

type PrismaClientLike = PrismaClient | Prisma.TransactionClient;

@Injectable()
export class UsersService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
    @Inject(ContextStorageServiceKey)
    private readonly contextStorageService: ContextStorageService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    prisma: PrismaClientLike,
    defaultRoles: UserRole[] = [UserRole.TENANT_ADMIN],
  ) {
    this.logger.log({ message: 'Creating user', createUserDto });

    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const userExists = await prisma.user.findFirst({
      where: {
        email: createUserDto.email,
        tenantId: createUserDto.tenantId,
      },
    });

    if (userExists) {
      throw new BadRequestException(
        'User with same email already exists for this tenant',
      );
    }

    const user = await prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return user;
  }

  async createWithTx(
    createUserDto: CreateUserDto,
    defaultRoles: UserRole[] = [UserRole.TENANT_ADMIN],
  ) {
    return this.prismaService.$transaction(async (tx) => {
      return await this.create(createUserDto, tx, defaultRoles);
    });
  }

  async listAll(query: SearchDto) {
    const { page, limit } = query;

    this.logger.log({
      message: 'Listing all users',
    });
    const users = await this.prismaService.user.findMany({
      where: this.constuctWhereClause(query),
    });
    return users.map((user) => UsersService.SanitizeUser(user));
  }

  private constuctWhereClause(query: SearchDto) {
    const { email, role } = query;
    const whereClause = {};

    whereClause['tenantId'] = {
      equals: this.contextStorageService.tenantId,
    };

    console.log(whereClause);

    if (email) {
      whereClause['email'] = {
        contains: email,
      };
    }

    if (role) {
      whereClause['roles'] = {
        has: role,
      };
    }

    return whereClause;
  }

  async list(options: SearchDto) {
    this.logger.log({ message: 'Listing users', options });
    const { page, limit, email, role } = options;
    return this.prismaService.user.findMany({
      where: {
        email: {
          contains: email,
        },
      },
      orderBy: options.orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne({ id, email }: { id?: string; email?: string }) {
    const user = await this.prismaService.user.findUnique({
      where: { id, email },
    });

    console.log(user);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    tx: PrismaClientLike,
    options: { shouldSanitize?: boolean } = { shouldSanitize: true },
  ) {
    this.logger.log({ message: 'Updating user by id', updateUserDto });
    const userExists = await tx.user.findUnique({ where: { id } });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const user = await tx.user.update({
      where: { id },
      data: updateUserDto,
    });

    if (!options.shouldSanitize) return user;

    return UsersService.SanitizeUser(user);
  }

  async updateWithTx(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.$transaction(async (tx) => {
      return await this.update(id, updateUserDto, tx);
    });
  }

  async delete(id: string, tx: PrismaClientLike) {
    this.logger.log('Removing user by id');
    const user = await tx.user.delete({ where: { id } });
    return UsersService.SanitizeUser(user);
  }

  async deleteWithTx(id: string) {
    return this.prismaService.$transaction(async (tx) => {
      return await this.delete(id, tx);
    });
  }

  public static SanitizeUser(user: Prisma.UserGetPayload<{}>) {
    const { password, ...userOnly } = user;
    return userOnly;
  }
}
