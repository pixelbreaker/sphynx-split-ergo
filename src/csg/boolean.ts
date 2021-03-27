
export const union2 = (...s: Shape2[]): Shape2 => {
  return {
    src2: `union(){${s.map(k => k.src2).join(' ')}}`
  };
}

export const union = (...s: Shape3[]): Shape3 => {
  return {
    src3: `union(){${s.map(k => k.src3).join(' ')}}`
  };
}

export const difference2 = (...s: Shape2[]): Shape2 => {
  return {
    src2: `difference(){${s.map(k => k.src2).join(' ')}}`
  };
}

export const difference = (...s: Shape3[]): Shape3 => {
  return {
    src3: `difference(){${s.map(k => k.src3).join(' ')}}`
  };
}

export const intersection2 = (...s: Shape2[]): Shape2 => {
  return {
    src2: `intersection(){${s.map(k => k.src2).join(' ')}}`
  };
}
export const intersection = (...s: Shape3[]): Shape3 => {
  return {
    src3: `intersection(){${s.map(k => k.src3).join(' ')}}`
  };
}