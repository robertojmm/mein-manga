import { HttpException, HttpStatus } from '@nestjs/common';

export class MangaNotFoundException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'Manga not found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
