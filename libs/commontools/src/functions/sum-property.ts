export function sumProperty(items: any[], prop: string): number {
  return items
    .map((item) => item[prop])
    .reduce((prev, current) => prev + current, 0);
}
