import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity/user.entity';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('Database error occurred');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected !== 0;
  }
}
