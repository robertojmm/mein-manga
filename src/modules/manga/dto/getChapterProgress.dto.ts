import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetChapterProgressDto {
  @IsNotEmpty()
  //@IsNumberString()
  @IsNumber()
  mangaId: number;

  @IsNotEmpty()
  @IsNumber()
  //@IsNumberString()
  chapterNo: number;

  userId: number;
}
