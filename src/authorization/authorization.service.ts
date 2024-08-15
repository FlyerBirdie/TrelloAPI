import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ColumnService } from 'src/column/column.service';
import { CardService } from 'src/card/card.service';
import { CommentService } from 'src/comment/comment.service';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly columnService: ColumnService,
    private readonly cardService: CardService,
    private readonly commentService: CommentService
  ) {}

  async checkColumnOwnership(userId: number, columnId: number): Promise<void> {
    try {
      await this.columnService.checkColumnOwnership(userId, columnId);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  async checkCardOwnership(userId: number, columnId: number, cardId: number): Promise<void> {
    try {
      await this.cardService.checkCardOwnership(userId, columnId, cardId);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  async checkCommentOwnership(userId: number, columnId: number, cardId: number, commentId: number): Promise<void> {
    try {
      await this.commentService.checkCommentOwnership(userId, columnId, cardId, commentId);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
