import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(user: any) {
    const { name, email } = user;
    this.name = name;
    this.email = email;
  }
}
