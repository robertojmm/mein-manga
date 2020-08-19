import * as Configstore from 'configstore';

const settings = new Configstore(
  'mein-manga',
  {
    MANGA_FOLDER: 'C:\\Users\\Roberto\\Desktop\\mangas',
    COVERS_FOLDER: 'C:\\Users\\Roberto\\Desktop\\covers',
  },
  { configPath: `${__dirname}/../settings.json` },
);

console.log(`${__dirname}/../settings.json`);

export default settings;
