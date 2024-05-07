export function defaultValueIsNull(value?: any, defaultValue?: any) {
  if (value == null) return defaultValue;
  return value;
}
