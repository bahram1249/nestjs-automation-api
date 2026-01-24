export function InTestRuntime() {
  if (process.env.NODE_ENV == 'test') return true;
  return false;
}
