import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

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

export class ChapterNotFoundException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'Chapter not found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor(userID: number | string = -1) {
    const msg = `The user: ID - ${userID} not found`;
    super(msg);
  }
}
