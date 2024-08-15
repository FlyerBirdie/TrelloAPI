import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users/:userId/columns/:columnId/cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
    @Body() createCardDto: CreateCardDto
  ) {
    return await this.cardService.create(userId, columnId, createCardDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number
  ) {
    return await this.cardService.findAll(userId, columnId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
    @Param('id') id: number
  ) {
    return await this.cardService.findOne(userId, columnId, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
    @Param('id') id: number,
    @Body() updateCardDto: UpdateCardDto
  ) {
    const card = await this.cardService.update(userId, columnId, id, updateCardDto);
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return card;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
    @Param('id') id: number
  ) {
    const success = await this.cardService.remove(userId, columnId, id);
    if (!success) {
      throw new NotFoundException('Card not found');
    }
    return { message: 'Card deleted successfully' };
  }
}
