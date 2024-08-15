import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ColumnEntity } from 'src/column/entities/column.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;
  
  @Column()
  name: string;

  @OneToMany(() => ColumnEntity, column => column.user, { cascade: true, onDelete: 'CASCADE' })
  columns: ColumnEntity[];
}