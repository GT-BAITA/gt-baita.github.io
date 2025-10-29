export function splitText(str: string): string[] {
  return str.split(/(?<=.)/);
}
