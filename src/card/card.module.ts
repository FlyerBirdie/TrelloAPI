import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card } from './entities/card.entity';
import { ColumnEntity } from '../column/entities/column.entity';
import { User } from '../user/entities/user.entity/user.entity';
import { ColumnModule } from 'src/column/column.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card, ColumnEntity, User]), forwardRef(() => ColumnModule)],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
