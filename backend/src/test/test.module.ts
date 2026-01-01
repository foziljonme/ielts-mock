import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { SectionsService } from './sections/sections.service';

@Module({
  controllers: [TestController],
  providers: [TestService, SectionsService],
})
export class TestModule {}
