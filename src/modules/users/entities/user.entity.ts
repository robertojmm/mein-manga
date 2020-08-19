import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('USERS')
export class User {
  @PrimaryColumn()
  uid: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;
}
