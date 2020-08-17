import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMangaDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
