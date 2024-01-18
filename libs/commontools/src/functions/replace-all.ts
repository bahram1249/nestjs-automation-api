export function replaceAll(
  str: string,
  find: RegExp | string,
  replace: string,
) {
  return str.replace(new RegExp(find, 'g'), replace);
}
