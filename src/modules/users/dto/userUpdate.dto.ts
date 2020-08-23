import { IsNotEmpty, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsNotEmpty()
  uid: string;

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
  /* constructor(user: any) {
    const { username, email } = user;
    this.username = username;
    this.email = email;
  } */
}
