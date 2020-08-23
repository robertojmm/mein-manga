import { UserDto } from './user.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserCompleteDto extends UserDto {
  @IsString()
  @IsNotEmpty()
  uid: string;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(user: any) {
    const { uid, ...userDto } = user;
    super(userDto);
    this.uid = uid;
  }
}
