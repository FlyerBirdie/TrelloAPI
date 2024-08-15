import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users/:userId/columns')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Param('userId') userId: number, @Body() createColumnDto: CreateColumnDto) {
    return this.columnService.create(userId, createColumnDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Param('userId') userId: number) {
    return this.columnService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('userId') userId: number, @Param('id') columnId: number) {
    return this.columnService.findOne(userId, columnId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('userId') userId: number,
    @Param('id') columnId: number,
    @Body() updateColumnDto: UpdateColumnDto
  ) {
    return this.columnService.update(userId, columnId, updateColumnDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('userId') userId: number, @Param('id') columnId: number) {
    await this.columnService.remove(userId, columnId);
  }
}
