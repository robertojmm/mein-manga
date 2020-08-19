import {
  IsNotEmpty,
  IsString,
  IsNumberString,
  IsNumber,
} from 'class-validator';

export class PrepareChapterDto {
  @IsNotEmpty()
  //@IsNumberString()
  @IsNumber()
  mangaId: number;

  @IsNotEmpty()
  @IsNumber()
  //@IsNumberString()
  chapterNo: number;
}
