import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
