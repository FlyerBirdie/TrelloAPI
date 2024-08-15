import { Injectable, NotFoundException, ForbiddenException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { User } from '../user/entities/user.entity/user.entity';
import { ColumnEntity } from './entities/column.entity';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(ColumnEntity)
    private columnRepository: Repository<ColumnEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(userId: number, createColumnDto: CreateColumnDto): Promise<{ id: number; title: string }> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const existingColumn = await this.columnRepository.findOne({
      where: { title: createColumnDto.title, user: { id: userId } },
    });
  
    if (existingColumn) {
      throw new ConflictException('Column with this title already exists for this user');
    }
  
    const column = this.columnRepository.create({
      ...createColumnDto,
      user,
    });
  
    const savedColumn = await this.columnRepository.save(column);
  
    return {
      id: savedColumn.id,
      title: savedColumn.title,
    };
  }

  async findAll(userId: number): Promise<ColumnEntity[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.columnRepository.find({ where: { user } });
  }

  async findOne(userId: number, columnId: number): Promise<ColumnEntity> {
    const column = await this.columnRepository.findOne({
      where: { id: columnId, user: { id: userId } },
    });

    if (!column) {
      throw new NotFoundException('Column not found');
    }
    return column;
  }

  async update(userId: number, columnId: number, updateColumnDto: UpdateColumnDto): Promise<ColumnEntity> {
    const column = await this.findOne(userId, columnId);
    if (!column) {
      throw new NotFoundException('Column not found');
    }

    if (updateColumnDto.title) {
      column.title = updateColumnDto.title;
    }

    return await this.columnRepository.save(column);
  }

  async remove(userId: number, columnId: number): Promise<void> {
    const column = await this.findOne(userId, columnId);
    if (!column) {
      throw new NotFoundException('Column not found');
    }

    await this.columnRepository.remove(column);
  }

  async checkColumnOwnership(userId: number, columnId: number): Promise<void> {
    const column = await this.columnRepository.findOne({
      where: { id: columnId, user: { id: userId } },
    });

    if (!column) {
      throw new UnauthorizedException('You do not have permission to access this column');
    }
  }
}
