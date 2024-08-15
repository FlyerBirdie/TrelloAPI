import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ColumnModule } from './column/column.module';
import { CardModule } from './card/card.module';
import { CommentModule } from './comment/comment.module';
import { Card } from './card/entities/card.entity';
import { ColumnEntity } from './column/entities/column.entity';
import { Comment } from './comment/entities/comment.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationService } from './authorization/authorization.service';
import { AuthorizationModule } from './authorization/authorization.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '141101',
      database: 'trello',
      entities: [User, ColumnEntity, Card, Comment],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ColumnModule,
    CardModule,
    CommentModule,
    TypeOrmModule.forFeature([User, ColumnEntity, Card, Comment, AuthGuard]),
    AuthorizationModule,
  ],
  controllers: [],
  providers: [AuthorizationService],
})
export class AppModule {}
