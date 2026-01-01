import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { PassagesService } from './passages.service';
import { SearchPassageDto } from './dto/search-passage.dto';
import { UpdatePassageDto } from './dto/update-passage.dto';

@Controller('passages')
export class PassagesController {
  constructor(private readonly passagesService: PassagesService) {}

  @Get()
  async findAll(@Query() searchPassageDto: SearchPassageDto) {
    return await this.passagesService.findAll(searchPassageDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.passagesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePassageDto: UpdatePassageDto,
  ) {
    return await this.passagesService.update(id, updatePassageDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.passagesService.delete(id);
  }
}
