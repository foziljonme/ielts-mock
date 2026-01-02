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
import { SectionsService } from './sections.service';
import { UpdateTestSectionDto } from './dto/update-test-section.dto';
import { SectionSearchDto } from './dto/search-section-dto';
import { CreatePassageDto } from '../passages/dto/create-passage.dto';
import { PassagesService } from '../passages/passages.service';
import { AudiosService } from '../audios/audios.service';
import { CreateAudioDto } from '../audios/dto/create-audio.dto';
import { CreateQuestionDto } from '../questions/dto/create-question.dto';
import { QuestionsService } from '../questions/questions.service';

@Controller('sections')
export class SectionsController {
  constructor(
    private readonly sectionsService: SectionsService,
    private readonly passagesService: PassagesService,
    private readonly audiosService: AudiosService,
    private readonly questionsService: QuestionsService,
  ) {}

  @Get()
  async findAll(@Query() sectionSearchDto: SectionSearchDto) {
    return await this.sectionsService.findAll(sectionSearchDto);
  }

  @Get(':sectionId')
  async findOne(@Param('sectionId') sectionId: string) {
    return await this.sectionsService.findOne(sectionId);
  }

  @Patch(':sectionId')
  async update(
    @Param('sectionId') sectionId: string,
    @Body() updateTestSectionDto: UpdateTestSectionDto,
  ) {
    return await this.sectionsService.updateWithTx(
      sectionId,
      updateTestSectionDto,
    );
  }

  @Delete(':sectionId')
  async delete(@Param('sectionId') sectionId: string) {
    return await this.sectionsService.delete(sectionId);
  }

  @Post(':sectionId/passages')
  async createPassage(
    @Param('sectionId') sectionId: string,
    @Body() createPassageDto: CreatePassageDto,
  ) {
    return await this.passagesService.createWithTx(sectionId, createPassageDto);
  }

  @Post(':sectionId/audios')
  async createAudio(
    @Param('sectionId') sectionId: string,
    @Body() createAudioDto: CreateAudioDto,
  ) {
    return await this.audiosService.createWithTx(sectionId, createAudioDto);
  }

  @Post(':sectionId/questions')
  async createQuestion(
    @Param('sectionId') sectionId: string,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return await this.questionsService.createWithTx(
      sectionId,
      createQuestionDto,
    );
  }
}
