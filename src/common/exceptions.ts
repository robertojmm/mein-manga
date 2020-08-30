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

export class MangaAlreadyExistsException extends HttpException {
  constructor() {
    super(
      { status: HttpStatus.CONFLICT, error: 'Manga already exists' },
      HttpStatus.CONFLICT,
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

export class ChapterNumberAlreadyExists extends HttpException {
  constructor(mangaName: string) {
    super(
      {
        status: HttpStatus.CONFLICT,
        error: `${mangaName} already has a chapter with that number`,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor(userID: number | string = -1) {
    const msg = `The user: ID - ${userID} not found`;
    super(msg);
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super(
      { status: HttpStatus.CONFLICT, error: 'User already exists' },
      HttpStatus.CONFLICT,
    );
  }
}

export class FileNotFoundException extends NotFoundException {
  constructor() {
    const msg = `File not found`;
    super(msg);
  }
}
