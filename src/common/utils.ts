import * as fs from 'fs';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function writeFileSyncWithSafeName(
  destination: string,
  name: string,
  file: any,
) {
  const finalFileName = `${destination}/${
    name.replace('/', '_')
    //  .replace(' ', '_')
  }`;
  fs.writeFileSync(finalFileName, file);
  return finalFileName;
}

export function createFolderIfNotExists(folderName: string): void {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
}