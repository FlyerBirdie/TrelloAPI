import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnEntity } from './entities/column.entity';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { User } from '../user/entities/user.entity/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ColumnEntity, User]), forwardRef(() => UserModule)],
  providers: [ColumnService],
  controllers: [ColumnController],
  exports: [ColumnService],
})
export class ColumnModule {}
