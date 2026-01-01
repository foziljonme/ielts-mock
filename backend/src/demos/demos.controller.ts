import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DemosService } from './demos.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('demos')
export class DemosController {
  constructor(private readonly demosService: DemosService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createDemoDto: any) {
    return this.demosService.create(createDemoDto);
  }

  @Get()
  listAll() {
    return this.demosService.listAll();
  }
}
