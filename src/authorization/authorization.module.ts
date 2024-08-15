import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { ColumnModule } from 'src/column/column.module';
import { CardModule } from 'src/card/card.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [ColumnModule, CardModule, CommentModule],
  providers: [AuthorizationService],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
