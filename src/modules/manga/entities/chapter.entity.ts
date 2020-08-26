import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Manga } from './manga.entity';

@Entity({ name: 'CHAPTERS' })
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  /*
  @Column({
    name: 'manga_id',
  })
  mangaId: number;
  */

  @ManyToOne(
    type => Manga,
    manga => manga.chapters,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  manga: Manga;

  @Column({
    name: 'file_path',
  })
  filePath: string;

  @Column({
    name: 'cover_path',
  })
  coverPath: string;

  @Column()
  pages: number;
}
