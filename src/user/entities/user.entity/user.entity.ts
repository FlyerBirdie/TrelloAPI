import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
//import { ColumnEntity } from '../column/column.entity';
import { Exclude } from 'class-transformer';

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

 // @OneToMany(() => ColumnEntity, column => column.user)
  //columns: ColumnEntity[];
}