import { Injectable, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Card } from './entities/card.entity';
import { ColumnEntity } from '../column/entities/column.entity';
import { User } from '../user/entities/user.entity/user.entity';
import { ColumnService } from '../column/column.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    private columnService: ColumnService,
  ) {}

  async create(userId: number, columnId: number, createCardDto: CreateCardDto): Promise<Card> {
    const column = await this.columnService.findOne(userId, columnId);
    if (!column) {
      throw new NotFoundException('Column not found');
    }

    if (column.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to add a card to this column');
    }

    const card = this.cardRepository.create({
      ...createCardDto,
      column,
    });

    try {
      return await this.cardRepository.save(card);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new Error('Database error occurred');
      }
      throw error;
    }
  }

  async findAll(userId: number, columnId: number): Promise<Card[]> {
    const column = await this.columnService.findOne(userId, columnId);
    if (!column) {
      throw new NotFoundException('Column not found');
    }

    return this.cardRepository.find({
      where: { column },
      relations: ['comments'],
    });
  }

  async findOne(userId: number, columnId: number, id: number): Promise<Card | null> {
    const column = await this.columnService.findOne(userId, columnId);
    if (!column) {
      throw new NotFoundException('Column not found');
    }

    const card = await this.cardRepository.findOne({
      where: { id, column },
      relations: ['comments'],
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return card;
  }

  async update(userId: number, columnId: number, id: number, updateCardDto: UpdateCardDto): Promise<Card | null> {
    const column = await this.columnService.findOne(userId, columnId);
    if (!column) {
      throw new NotFoundException('Column not found');
    }

    const card = await this.cardRepository.findOne({ where: { id, column } });
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.column.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to update this card');
    }

    await this.cardRepository.update(id, updateCardDto);
    return this.findOne(userId, columnId, id);
  }

  async remove(userId: number, columnId: number, id: number): Promise<boolean> {
    const column = await this.columnService.findOne(userId, columnId);
    if (!column) {
      throw new NotFoundException('Column not found');
    }

    const card = await this.cardRepository.findOne({ where: { id, column } });
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.column.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this card');
    }

    const result = await this.cardRepository.delete(id);
    return result.affected !== 0;
  }

  async checkCardOwnership(userId: number, columnId: number, cardId: number): Promise<void> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId, column: { id: columnId, user: { id: userId } } },
    });

    if (!card) {
      throw new UnauthorizedException('You do not have permission to access this card');
    }
  }
}
