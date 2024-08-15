import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users/:userId/columns/:columnId/cards/:cardId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Body() createCommentDto: CreateCommentDto
  ) {
    return await this.commentService.create(userId, columnId, cardId, createCommentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
  ) {
    return await this.commentService.findAll(userId, columnId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Param('id') id: number
  ) {
    return await this.commentService.findOne(userId, columnId, cardId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto
  ) {
    const comment = await this.commentService.update(userId, columnId, cardId, id, updateCommentDto);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Param('id') id: number
  ) {
    const success = await this.commentService.remove(userId, columnId, cardId, id);
    if (!success) {
      throw new NotFoundException('Comment not found');
    }
    return { message: 'Comment deleted successfully' };
  }
}
