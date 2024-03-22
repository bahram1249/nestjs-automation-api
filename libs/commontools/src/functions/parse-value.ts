export function parseValue(value: string): any {
  try {
    return JSON.parse(value); // Attempt JSON parsing for numbers and booleans
  } catch (error) {
    return value; // Default to string if parsing fails
  }
}
