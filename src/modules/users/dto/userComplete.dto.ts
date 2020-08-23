import { UserDto } from './user.dto';
import { IsString, IsNotEmpty } from 'class-validator';

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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(user: any) {
    const { uid, username, email } = user;
    //super(userDto);
    this.uid = uid;
    this.username = username;
    this.email = email;
  }
}
