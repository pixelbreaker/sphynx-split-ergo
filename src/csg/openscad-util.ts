import { Shape } from "./base";


export const serialize = (o: any) => {
  if (!o) {
    return '';
  }
  if (Array.isArray(o) || typeof o !== 'object') {
    return JSON.stringify(o);
  }
  return Object.entries(o)
    .map(([key, val]) => `${key} = ${JSON.stringify(val)}`)
    .join(',');
}
export const indent = (s: string) => '  ' + s;
