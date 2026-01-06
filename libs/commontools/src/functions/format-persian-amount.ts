export function formatPersianAmount(amount: bigint): string {
  // Convert to string, add comma separators, convert to Persian numerals
  const amountStr = amount.toString();
  const withCommas = amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
  return withCommas.replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
}
