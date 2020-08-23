import { UserDto } from './user.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  /*  constructor(user: any) {
    console.log(user);
    super(user);
    /* const { password, ...userDto } = user;
    super(userDto);
    this.password = password; 
  } */
}
