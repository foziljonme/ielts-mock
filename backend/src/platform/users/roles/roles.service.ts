// import { Inject, Injectable, type LoggerService } from '@nestjs/common';
// import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { CreateRoleDto } from '../dto/create-role.dto';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// export class RolesService {
//   constructor(
//     @Inject(WINSTON_MODULE_NEST_PROVIDER)
//     private readonly logger: LoggerService,
//     private readonly prismaService: PrismaService,
//   ) {}

//   async createRole(roleDto: CreateRoleDto) {
//     this.logger.log({ message: 'Creating role', roleDto });
//     return this.prismaService.userRole.create({
//       data: {
//         name: roleDto.name,
//         permissionIds: roleDto.permissionIds,
//       },
//     });
//   }
// }
