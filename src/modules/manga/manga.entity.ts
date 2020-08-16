import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'MANGAS' })
export class Manga {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
