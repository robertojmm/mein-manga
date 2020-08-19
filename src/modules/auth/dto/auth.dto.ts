import { IsString, IsNotEmpty } from 'class-validator';
export class AuthDto {
  @IsNotEmpty()
  @IsString()
  readonly emailOrUid: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
