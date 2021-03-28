import { Shape } from "./base";


export const serialize = (o: any) => {
  if (Array.isArray(o) || typeof o !== 'object') {
    return JSON.stringify(o);
  }
  return Object.entries(o)
    .map(([key, val]) => `${key} = ${JSON.stringify(val)}`)
    .join(',');
}
export const indent = (s: string) => '  ' + s;

export const expand = (s: Shape<unknown>[]) =>
  s.flatMap(k => k.src).map(indent);