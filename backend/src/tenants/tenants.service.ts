import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  type LoggerService,
} from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SearchTenantDto } from './dto/search-tenant.dto';
import { Prisma } from 'prisma/generated/client';

@Injectable()
export class TenantsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    this.logger.log({ message: 'Creating tenant', createTenantDto });
    // 1. Check if tenant already exists
    const tenantExists = await this.prismaService.tenant.findUnique({
      where: {
        subdomain: createTenantDto.subdomain,
      },
    });

    if (tenantExists) {
      this.logger.error('Tenant already exists');
      throw new BadRequestException('Tenant already exists');
    }

    this.logger.log('Creating tenant');
    const tenant = await this.prismaService.tenant.create({
      data: createTenantDto,
    });

    return tenant;
  }

  async listAll(query: SearchTenantDto) {
    this.logger.log('Listing all tenants');
    const searchWhere: Prisma.TenantWhereInput = { isActive: true };
    if ('isActive' in query) {
      searchWhere.isActive = query.isActive;
    }
    if (query.name) {
      searchWhere.name = {
        contains: query.name,
      };
    }

    const tenants = await this.prismaService.tenant.findMany({
      where: searchWhere,
    });
    return tenants;
  }

  async get(id: string) {
    this.logger.log(`Listing tenant with id ${id}`);
    const tenant = await this.prismaService.tenant.findUnique({
      where: {
        id,
      },
    });

    if (!tenant) {
      this.logger.error(`Tenant with id ${id} not found`);
      throw new NotFoundException(`Tenant with id ${id} not found`);
    }

    return tenant;
  }

  async getBySubdomain(subdomain: string) {
    this.logger.log(`Listing tenant with subdomain ${subdomain}`);
    const tenant = await this.prismaService.tenant.findUnique({
      where: {
        subdomain,
      },
    });

    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto) {
    this.logger.log(`Updating tenant with id ${id}`);
    // This will throw if tenant doesn't exist
    await this.get(id);

    const tenant = await this.prismaService.tenant.update({
      where: {
        id,
      },
      data: updateTenantDto,
    });

    return tenant;
  }

  async deactivate(id: string) {
    this.logger.log(`Deactivating tenant with id ${id}`);
    // This will throw if tenant doesn't exist
    await this.get(id);

    const tenant = await this.prismaService.tenant.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });

    return tenant;
  }

  async activate(id: string) {
    this.logger.log(`Activating tenant with id ${id}`);
    // This will throw if tenant doesn't exist
    await this.get(id);

    const tenant = await this.prismaService.tenant.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
    });

    return tenant;
  }

  async delete(id: string) {
    this.logger.log(`Removing tenant with id ${id}`);
    // This will throw if tenant doesn't exist
    await this.get(id);

    const tenant = await this.prismaService.tenant.delete({
      where: {
        id,
      },
    });

    return tenant;
  }

  async getDashboard(tenantId: string) {
    this.logger.log('Listing dashboard');
    const dashboard = await this.prismaService.tenant.findUnique({
      where: {
        id: tenantId,
      },
      include: {},
    });
    return dashboard;
  }
}
