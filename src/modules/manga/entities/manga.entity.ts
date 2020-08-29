import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Chapter } from './chapter.entity';
import { UserMangaChapter } from './user-manga-chapter.entity';

@Entity({ name: 'MANGAS' })
export class Manga {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    name: 'chapter_amount',
    default: 0,
  })
  chapterAmount: number;

  @OneToMany(
    type => Chapter,
    chapter => chapter.manga,
  )
  chapters: Chapter[];

  @OneToMany(
    type => UserMangaChapter,
    userMangaChapter => userMangaChapter.manga,
  )
  usersReading: UserMangaChapter[];
}
