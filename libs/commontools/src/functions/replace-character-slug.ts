import { replaceAll } from './replace-all';

export function replaceCharacterSlug(str: string): string {
  str = replaceAll(str, ' ', '-');
  str = replaceAll(str, '_', '-');
  str = replaceAll(str, '/', '-');
  str = replaceAll(str, ':', '-');
  str = replaceAll(str, ',', '-');
  str = replaceAll(str, ';', '-');
  str = replaceAll(str, "'", '-');
  str = replaceAll(str, '"', '-');
  str = replaceAll(str, `[?]`, '');
  return str;
}
