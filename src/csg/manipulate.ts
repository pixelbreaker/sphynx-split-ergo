export const translate = (p: Vec3, s: Shape3): Shape3 => {
  return {
    src3: `translate(${JSON.stringify(p)}) ${s.src3}`
  };;
};

export const rotate = (p: Vec3, s: Shape3): Shape3 => {
  return {
    src3: `rotate(${JSON.stringify(p)}) ${s.src3}`
  };
};

export const mirror = (p: Vec3, s: Shape3): Shape3 => {
  return {
    src3: `mirror(${JSON.stringify(p)}) ${s.src3}`
  };
};

/**
 * 
 * @param c hex string or color name
 * @param s 
 * @returns colored shaped
 */
export const color = (c: string, s: Shape3): Shape3 => {
  return {
    src3: `color("${s}") ${s.src3}`
  };
};
