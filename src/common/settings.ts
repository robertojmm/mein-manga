import * as Configstore from 'configstore';

const settings = new Configstore(
  'mein-manga',
  {
    MANGA_FOLDER: 'C:\\Users\\Roberto\\Desktop\\mein-manga/mangas',
    STATIC_FOLDER: 'C:\\Users\\Roberto\\Desktop\\mein-manga/static',
    READING_FOLDER: 'C:\\Users\\Roberto\\Desktop\\mein-manga/static/reading',
    MANGA_COVERS_FOLDER:
      'C:\\Users\\Roberto\\Desktop\\mein-manga/static/manga_covers',
    CHAPTER_COVERS_FOLDER:
      'C:\\Users\\Roberto\\Desktop\\mein-manga/static/chapter_covers',
  },
  { configPath: `${__dirname}/../settings.json` },
);

console.log(`SETTINGS FILE PATH: ${__dirname}/../settings.json`);

export default settings;
