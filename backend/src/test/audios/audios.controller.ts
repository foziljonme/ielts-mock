import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { AudiosService } from './audios.service';
import { SearchAudioDto } from './dto/search-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';

@Controller('audios')
export class AudiosController {
  constructor(private readonly audiosService: AudiosService) {}

  @Get()
  async findAll(@Query() searchAudioDto: SearchAudioDto) {
    return await this.audiosService.findAll(searchAudioDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.audiosService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAudioDto: UpdateAudioDto,
  ) {
    return await this.audiosService.update(id, updateAudioDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.audiosService.delete(id);
  }
}
