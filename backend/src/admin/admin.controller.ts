import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import type { JwtPayloadBase } from 'src/auth/entities/token.entity';
import { SessionsService } from 'src/exam/sessions/sessions.service';
import { SearchSessionsDto } from 'src/exam/sessions/dto/search-sessions.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Get('/sessions')
  async getSessions(
    @GetCurrentUser() user: JwtPayloadBase,
    @Query() query: SearchSessionsDto,
  ) {
    return await this.sessionsService.findAll(user.tenantId, query);
  }

  @Get('/stats')
  async getSessionStats(@GetCurrentUser() user: JwtPayloadBase) {
    return await this.adminService.getStats(user.tenantId);
  }
}
