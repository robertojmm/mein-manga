import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manga } from './manga.entity';

import { MANGA_REPOSITORY_TOKEN } from '../../common/config/databaseTokens.constants';

@Injectable()
export class MangaService {
  constructor(
    @Inject(MANGA_REPOSITORY_TOKEN)
    private readonly mangaRepository: Repository<Manga>,
  ) {}

  findAll(): Promise<Manga[]> {
    return this.mangaRepository.find();
  }

  findOne(id: number): Promise<Manga> {
    return this.mangaRepository.findOne(id);
  }
}
