
export const serialize = (o: any) => {
  if (Array.isArray(o) || typeof o !== 'object') {
    return JSON.stringify(o);
  }
  return Object.entries(o)
    .map(([key, val]) => `${key} = ${JSON.stringify(val)}`)
    .join(',');
}
export const indent = (s: string) => s.split('\n').map(r => '  ' + r).join('\n');
export const shape = <T extends Shape>(s: string) => ({ src: s }) as T;
export const shape2 = (s: string) => ({ src: s }) as Shape2;
export const shape3 = (s: string) => ({ src: s }) as Shape3;