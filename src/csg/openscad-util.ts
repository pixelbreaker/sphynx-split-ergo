
export const serialize = (o: any) => {
  return Object.entries(o)
    .map((key, val) => `${key} = ${JSON.stringify(val)}`)
    .join(',');
}