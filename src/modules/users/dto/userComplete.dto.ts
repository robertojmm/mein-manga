import { UserDto } from './user.dto';
import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { Role } from '../entities/role.entity';

export class UserCompleteDto {
  @IsString()
  @IsNotEmpty()
  uid: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsArray()
  @IsNotEmpty()
  roles: string[];

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(user: any) {
    console.log('xd');
    console.log(user);
    const { uid, username, email, roles } = user;
    //super(userDto);
    this.uid = uid;
    this.username = username;
    this.email = email;

    this.roles = roles.map((role: Role) => role.name);
  }
}
