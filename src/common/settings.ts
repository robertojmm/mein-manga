import * as Configstore from 'configstore';

const settings = new Configstore(
  'mein-manga',
  {
    MANGA_FOLDER: 'C:\\Users\\Roberto\\Desktop\\mein-manga/mangas',
    COVERS_FOLDER: 'C:\\Users\\Roberto\\Desktop\\mein-manga/covers',
    TEMP_FOLDER: 'C:\\Users\\Roberto\\Desktop\\mein-manga/temp',
  },
  { configPath: `${__dirname}/../settings.json` },
);

console.log(`SETTINGS FILE PATH: ${__dirname}/../settings.json`);

export default settings;
