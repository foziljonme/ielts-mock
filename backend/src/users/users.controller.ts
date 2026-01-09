import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchDto } from './dto/search.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createWithTx(createUserDto);
  }

  @Get()
  async listAll(@Query() query: SearchDto) {
    return await this.usersService.listAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id?: string, @Query('email') email?: string) {
    return await this.usersService.findOne({ email, id });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateWithTx(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.usersService.deleteWithTx(id);
  }
}
