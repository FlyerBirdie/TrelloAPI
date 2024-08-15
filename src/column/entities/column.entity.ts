import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity/user.entity';
import { Card } from 'src/card/entities/card.entity';

@Entity()
export class ColumnEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User, user => user.columns, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Card, card => card.column, { cascade: true, onDelete: 'CASCADE' })
  cards: Card[];
}
