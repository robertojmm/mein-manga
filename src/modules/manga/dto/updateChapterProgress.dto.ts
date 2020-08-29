import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateChapterProgressDto {
  @IsNotEmpty()
  //@IsNumberString()
  @IsNumber()
  mangaId: number;

  @IsNotEmpty()
  @IsNumber()
  //@IsNumberString()
  chapterNo: number;

  @IsNotEmpty()
  @IsNumber()
  page: number;

  userId: number;
}
