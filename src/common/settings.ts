import * as Configstore from 'configstore';

const settings = new Configstore(
  'mein-manga',
  {
    MANGA_FOLDER: 'XDD',
  },
  { configPath: `${__dirname}/../settings.json` },
);

console.log(`${__dirname}/../settings.json`);

export default settings;
