import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { SearchQuestionDto } from './dto/search-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { OptionsService } from '../options/options.service';
import { CreateOptionsDto } from '../options/dto/create-options.dto';

@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly optionsService: OptionsService,
  ) {}

  @Get()
  async findAll(@Query() searchQuestionDto: SearchQuestionDto) {
    return await this.questionsService.findAllWithTx(searchQuestionDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.questionsService.findOneWithTx(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return await this.questionsService.updateWithTx(id, updateQuestionDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.questionsService.deleteWithTx(id);
  }

  @Post(':questionId/options')
  async createOption(
    @Param('questionId') questionId: string,
    @Body() createOptionDto: CreateOptionsDto,
  ) {
    return await this.optionsService.createWithTx(questionId, createOptionDto);
  }
}
