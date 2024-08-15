import { Card } from 'src/card/entities/card.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Card, (card) => card.comments, { onDelete: 'CASCADE' })
  card: Card;
}
