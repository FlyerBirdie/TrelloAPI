import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { Card } from '../card/entities/card.entity';
import { ColumnEntity } from '../column/entities/column.entity';
import { User } from '../user/entities/user.entity/user.entity';
import { CardModule } from 'src/card/card.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Card, ColumnEntity, User]), forwardRef(() => CardModule)],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
