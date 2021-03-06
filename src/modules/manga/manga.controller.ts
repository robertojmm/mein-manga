import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Delete,
  Req,
  Put,
  UploadedFiles,
} from '@nestjs/common';
import { MangaService } from './services/manga.service';
import { Manga } from './entities/manga.entity';
import { Chapter } from './entities/chapter.entity';
import { CreateMangaDto } from './dto/createManga.dto';
import { NewChapterDto } from './dto/newChapter.dto';
import { ChaptersService } from './services/chapters.service';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import settings from '../../common/settings';
import { PrepareChapterDto } from './dto/prepareChapter.dto';
import { UpdateChapterProgressDto } from './dto/updateChapterProgress.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { GetChapterProgressDto } from './dto/getChapterProgress.dto';
import { UserMangaChapter } from './entities/user-manga-chapter.entity';
import { FileNotFoundOnRequestException } from 'src/common/exceptions';

@Controller('manga')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class MangaController {
  constructor(
    private readonly mangaService: MangaService,
    private readonly chaptersService: ChaptersService,
  ) {}

  @Get()
  @Roles('user')
  async getMangas(): Promise<Manga[]> {
    return await this.mangaService.getMangas();
  }

  @Get(':id')
  @Roles('user')
  async getManga(@Param('id') id: number): Promise<Manga> {
    return await this.mangaService.getManga(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: settings.get('MANGA_COVERS_FOLDER'),
        filename: (req, file, callback) => {
          callback(null, file.originalname);
        },
      }),
    }),
  )
  @Roles('admin')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  createManga(
    @Body() createMangaDto: CreateMangaDto,
    @UploadedFile() file: any,
  ): Promise<Manga> {
    if (!file) {
      throw new FileNotFoundOnRequestException();
    }
    return this.mangaService.createManga(createMangaDto, file);
  }

  @Delete('deleteManga/:id')
  @Roles('admin')
  deleteManga(@Param('id') id: number) {
    console.log('deleting manga');
    return this.mangaService.deleteManga(id);
  }

  ///////////// CHAPTERS /////////////

  @Get(':id/chapters')
  @Roles('user')
  getChapters(@Param('id') id: number): Promise<Manga> {
    return this.mangaService.getMangaWithChapters(id);
  }

  @Get(':id/chapter/:chapterNo')
  @Roles('user')
  async getChapter(
    @Param('id') id: number,
    @Param('chapterNo') chapterNo: number,
  ): Promise<Chapter> {
    //return specific chapter of a manga
    return await this.mangaService.getChapter(id, chapterNo);
  }

  @Post(':id/chapters') //TODO test roles here
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: settings.get('MANGA_FOLDER'),
        filename: (req, file, callback) => {
          callback(null, file.originalname);
        },
      }),
    }),
  )
  @Roles('admin')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  newChapter(
    @Param('id') id: number,
    @Body() newChapterDto: NewChapterDto,
    @UploadedFile() file: any,
  ): Promise<Chapter> {
    if (!file) {
      throw new FileNotFoundOnRequestException();
    }
    return this.chaptersService.saveChapter(id, newChapterDto, file);
  }

  @Post('prepareChapter')
  @Roles('user')
  prepareChapter(
    @Body() prepareChapterDto: PrepareChapterDto,
  ): Promise<string[]> {
    return this.chaptersService.prepareChapter(
      prepareChapterDto.mangaId,
      prepareChapterDto.chapterNo,
    );
  }

  @Post('updateChapterProgress')
  @Roles('user')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  updateChapterProgress(
    @Body() body: UpdateChapterProgressDto,
    @User() user,
  ): Promise<void> {
    const { userId } = user;
    console.log(userId);
    console.log(body);
    this.chaptersService.updateChapterProgress({ userId, ...body });
    return Promise.resolve();
  }

  @Post('continueReading')
  @Roles('user')
  getContinueReading(
    @Body() body: { userId: number },
  ): Promise<UserMangaChapter[]> {
    return this.chaptersService.getContinueReading(body.userId);
  }

  @Post('latestUploads')
  @Roles('user')
  getLatestUploads(): Promise<Chapter[]> {
    return this.chaptersService.getLatestUploads();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Post('getChapterProgress')
  @Roles('user')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getChapterProgress(
    @Body() body: GetChapterProgressDto,
    @User() user,
  ): Promise<UserMangaChapter> {
    const { userId } = user;
    return this.chaptersService.getChapterProgress({ userId, ...body });
  }

  @Delete(':mangaId/chapters/:chapterNo')
  @Roles('admin')
  deleteChapter(
    /* @Body() chapterDto: PrepareChapterDto */
    @Param('mangaId') mangaId: number,
    @Param('chapterNo') chapterNo: number,
  ) {
    return this.chaptersService.deleteChapter({ mangaId, chapterNo });
  }
  //"/manga/:id/chapters/:chapterNo"
  @Put(':mangaId/chapters/:chapterNo')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'newFile', maxCount: 1 },
      { name: 'newChapterPoster', maxCount: 1 },
    ]),
  )
  @Roles('admin')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  updateChapter(
    @Param('mangaId') mangaId: number,
    @Param('chapterNo') chapterNo: number,
    @Body() body: { newChapterNo: number },
    @UploadedFiles() files: any,
  ): Promise<Chapter> {
    return this.chaptersService.updateChapter(
      mangaId,
      chapterNo,
      body.newChapterNo,
      files,
    );
  }
}
