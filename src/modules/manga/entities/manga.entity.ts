import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Chapter } from './chapter.entity';

@Entity({ name: 'MANGAS' })
export class Manga {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    name: 'chapter_amount',
  })
  chapterAmount: number;

  @OneToMany(
    type => Chapter,
    chapter => chapter.manga,
  )
  chapters: Chapter[];
}
