import { Injectable, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Card } from '../card/entities/card.entity';
import { CardService } from '../card/card.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private cardService: CardService,
  ) {}

  async create(userId: number, columnId: number, cardId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const card = await this.cardService.findOne(userId, columnId, cardId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      card,
    });

    try {
      return await this.commentRepository.save(comment);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new Error('Database error occurred');
      }
      throw error;
    }
  }

  async findAll(userId: number, columnId: number): Promise<Comment[]> {
    const card = await this.cardService.findAll(userId, columnId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return this.commentRepository.find({
      where: { card },
    });
  }

  async findOne(userId: number, columnId: number, id: number): Promise<Comment | null> {
    const card = await this.cardService.findOne(userId, columnId, id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const comment = await this.commentRepository.findOne({
      where: { id, card },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(userId: number, columnId: number, cardId: number, id: number, updateCommentDto: UpdateCommentDto): Promise<Comment | null> {
    const card = await this.cardService.findOne(userId, columnId, cardId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const comment = await this.commentRepository.findOne({ where: { id, card } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // In this example, we're assuming that users have the right to update their own comments.
    // If different logic is needed, adjust this check accordingly.
    if (comment.card.column.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to update this comment');
    }

    await this.commentRepository.update(id, updateCommentDto);
    return this.findOne(userId, cardId, id);
  }

  async remove(userId: number, columnId: number, cardId: number, id: number): Promise<boolean> {
    const card = await this.cardService.findOne(userId, columnId, cardId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const comment = await this.commentRepository.findOne({ where: { id, card } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.card.column.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this comment');
    }

    const result = await this.commentRepository.delete(id);
    return result.affected !== 0;
  }

  async checkCommentOwnership(userId: number, columnId: number, cardId: number, commentId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, card: { id: cardId, column: { id: columnId, user: { id: userId } } } },
    });

    if (!comment) {
      throw new UnauthorizedException('You do not have permission to access this comment');
    }
  }
}
