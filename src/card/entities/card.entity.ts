import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ColumnEntity } from 'src/column/entities/column.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => ColumnEntity, (column) => column.cards, { onDelete: 'CASCADE' })
  column: ColumnEntity;

  @OneToMany(() => Comment, (comment) => comment.card, { cascade: true, onDelete: 'CASCADE' })
  comments: Comment[];
}
