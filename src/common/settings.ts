import * as Configstore from 'configstore';

const APPFOLDER = `${__dirname}/../../../mein-manga_data`;
const WEB_FOLDER = `${__dirname}/../../web/dist`;
const STATIC_FOLDER = `${APPFOLDER}/static`;
console.log(`WEB FOLDER: ${WEB_FOLDER}`);

const settings = new Configstore(
  'mein-manga',
  {
    APPFOLDER,
    WEB_FOLDER,
    MANGA_FOLDER: `${APPFOLDER}/mangas`,
    STATIC_FOLDER,
    READING_FOLDER: `${STATIC_FOLDER}/reading`,
    MANGA_COVERS_FOLDER: `${STATIC_FOLDER}/manga_covers`,
    CHAPTER_COVERS_FOLDER: `${STATIC_FOLDER}/chapter_covers`,
  },
  { configPath: `${__dirname}/../settings.json` },
);

console.log(`SETTINGS FILE PATH: ${__dirname}/../settings.json`);

export default settings;
