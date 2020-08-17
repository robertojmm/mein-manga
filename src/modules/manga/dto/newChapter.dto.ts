import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class NewChapterDto {
  @IsNotEmpty()
  //@IsNumber()
  @IsNumberString()
  number: number;

  // Add File, save file, extract cover, save cover
}
