import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';

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
}
