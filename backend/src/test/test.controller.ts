import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { CreateTestSectionDto } from './sections/dto/create-test-section.dto';
import { SectionsService } from './sections/sections.service';
import { UpdateTestSectionDto } from './sections/dto/update-test-section.dto';

@Controller('tests')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly sectionsService: SectionsService,
  ) {}

  @Get('/sections/listening/:id')
  async getListening(@Param('id') id: string) {
    return await this.testService.getListeningFromJson(id);
  }

  @Post()
  async create(@Body() createTestDto: CreateTestDto) {
    return await this.testService.create(createTestDto);
  }

  @Get()
  async findAll() {
    return await this.testService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.testService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return await this.testService.update(id, updateTestDto);
  }

  @Delete(':id')
  async deleteTest(@Param('id') id: string) {
    return await this.testService.delete(id);
  }

  @Post(':testId/sections')
  async createSection(
    @Param('testId') testId: string,
    @Body() createTestSectionDto: CreateTestSectionDto,
  ) {
    return await this.sectionsService.createWithTx(
      testId,
      createTestSectionDto,
    );
  }
}
