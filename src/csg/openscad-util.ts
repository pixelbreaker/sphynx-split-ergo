import { Shape } from "./base";


export const serialize = (o: any) => {
  if (Array.isArray(o) || typeof o !== 'object') {
    return JSON.stringify(o);
  }
  return Object.entries(o)
    .map(([key, val]) => `${key} = ${JSON.stringify(val)}`)
    .join(',');
}
export const indent = (s: string) => s.split('\n').map(r => '  ' + r).join('\n');


export const expand = (s: Shape<unknown>[]) => `{\n${s.map(k => indent(k.src)).join('\n')}\n}`;