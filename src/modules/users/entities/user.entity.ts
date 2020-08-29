import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { UserMangaChapter } from 'src/modules/manga/entities/user-manga-chapter.entity';

@Entity('USERS')
export class User {
  @PrimaryGeneratedColumn()
  uid: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @ManyToMany(
    type => Role,
    role => role.users,
  )
  @JoinTable()
  roles: Role[];

  @OneToMany(
    type => UserMangaChapter,
    userMangaChapter => userMangaChapter.user,
  )
  mangasReading: UserMangaChapter[];
}
