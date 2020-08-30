import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Manga } from './manga.entity';
import { UserMangaChapter } from './user-manga-chapter.entity';

@Entity({ name: 'CHAPTERS' })
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

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

  @Column({
    name: 'cover_web_path',
  })
  coverWebPath: string;

  @Column()
  pages: number;

  @OneToMany(
    type => UserMangaChapter,
    userMangaChapter => userMangaChapter.chapter,
  )
  usersReading: UserMangaChapter[];
}
