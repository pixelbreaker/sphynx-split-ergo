import { serialize, shape3 } from "./openscad-util"

export type ExtrudeProps = FProp<{
  height: number,
  center?: boolean,
  convexity?: number,
  twist?: number,
  slices?: number,
  scale?: number,
}>;
export const linear_extrude = (p: ExtrudeProps, s: Shape2): Shape3 => {
  return shape3(`linear_extrude(${serialize(p)}) ${s.src}`);
}

export type RotateExtrudeProps = FProp<{
  angle?: number,
  convexity?: number
}>;

export const rotate_extrude = (p: RotateExtrudeProps, s: Shape2): Shape3 => {
  return shape3(`rotate_extrude(${serialize(p)}) ${s.src}`);
}


export const scale = (p: FProp<Vec3>, s: Shape3): Shape3 => {
  return shape3(`scale(${serialize(p)}) ${s.src}`);
}

