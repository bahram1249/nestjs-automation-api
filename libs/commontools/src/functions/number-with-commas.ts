export function numberWithCommas(x: number) {
  let numberString = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(numberString))
    numberString = numberString.replace(pattern, '$1,$2');
  return numberString;
}
