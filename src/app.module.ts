import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Column } from './column/column.entity';
// import { Card } from './card/card.entity';
// import { Comment } from './comment/comment.entity';
import { User } from './user/entities/user.entity/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '141101',
      database: 'trello',
      entities: [User],//, Column, Card, Comment],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([User]), //, Column, Card, Comment]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
