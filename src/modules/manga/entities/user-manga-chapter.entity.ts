import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Manga } from './manga.entity';
import { Chapter } from './chapter.entity';

@Entity()
export class UserMangaChapter {
  @ManyToOne(
    type => User,
    user => user.mangasReading,
    { primary: true },
  )
  user: User;

  @ManyToOne(
    type => Manga,
    manga => manga.usersReading,
    { primary: true },
  )
  manga: Manga;

  @ManyToOne(
    type => Chapter,
    chapter => chapter.usersReading,
    { primary: true },
  )
  chapter: Chapter;

  @Column({ nullable: false })
  page: number;
}
