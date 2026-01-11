import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SessionsService } from 'src/exam/sessions/sessions.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, SessionsService],
})
export class AdminModule {}
