import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { OptionsService } from './options.service';
import { SearchOptionsDto } from './dto/search-options.dto';
import { UpdateOptionsDto } from './dto/update-options.dto';

@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Get()
  async findAll(@Query() searchOptionsDto: SearchOptionsDto) {
    return await this.optionsService.findAllWithTx(searchOptionsDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.optionsService.findOneWithTx(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOptionsDto: UpdateOptionsDto,
  ) {
    return await this.optionsService.updateWithTx(id, updateOptionsDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.optionsService.deleteWithTx(id);
  }
}
