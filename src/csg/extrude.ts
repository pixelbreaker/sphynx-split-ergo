import { serialize } from "./openscad-util"

export type ExtrudeProps = FProp<{
  height: number,
  center?: boolean,
  convexity?: number,
  twist?: number,
  slices?: number,
  scale?: number,
}>;
export const linear_extrude = (p: ExtrudeProps, s: Shape2): Shape3 => {
  return {
    src3: `linear_extrude(${serialize(p)}) ${s.src2}`
  }
}

export type RotateExtrudeProps = FProp<{
  angle?: number,
  convexity?: number
}>;

export const rotate_extrude = (p: RotateExtrudeProps, s: Shape2): Shape3 => {
  return {
    src3: `rotate_extrude(${serialize(p)}) ${s.src2}`
  }
}


export const scale = (p: FProp<Vec3>, s: Shape3): Shape3 => {
  return {
    src3: `scale(${serialize(p)}) ${s.src3}`
  }
}

