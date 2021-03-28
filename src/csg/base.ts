import { expand, indent, serialize } from "./openscad-util";

export type Props = {
  $fn?: number;
  $fa?: number;
  $fs?: number;
}
export type FProp<T> = T & Props;

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

const createListFn = (name: string) =>
  <T>(...s: Shape<T>[]): Shape<T> =>
    new Shape<T>([`${name}() {`, ...s.flatMap(k => k.src).map(indent), '}']);

export const union = createListFn('union');
export const difference = createListFn('difference');
export const intersection = createListFn('intersection');
export const hull = createListFn('hull');
export const minkowski = createListFn('minkowski');

export type TileProps = {
  translation: Vec3;
  times: number;
  opposite?: boolean;
}
export class Shape<T> {
  src: string[];
  props: T;
  constructor(src: string[]) {
    this.src = src;
  }

  union(s: Shape<T>, ...rest: Shape<T>[]): Shape<T> {
    return union(this, s, ...rest);
  }

  difference(s: Shape<T>, ...rest: Shape<T>[]): Shape<T> {
    return difference<T>(this, s, ...rest);
  }

  intersection(s: Shape<T>, ...rest: Shape<T>[]): Shape<T> {
    return intersection<T>(this, s, ...rest);
  }

  scale(p: Vec3) {
    return new Shape<T>([`scale(${serialize(p)})`, ...this.src.map(indent)]);
  }

  translate(p: Vec3) {
    return new Shape<T>([`translate(${JSON.stringify(p)})`, ...this.src.map(indent)]);
  };

  rotate(p: Vec3) {
    return new Shape<T>([`rotate(${JSON.stringify(p)})`, ...this.src.map(indent)]);
  };

  mirror(p: Vec3) {
    return new Shape<T>([`mirror(${JSON.stringify(p)})`, ...this.src.map(indent)]);
  };

  color(c: string) {
    return new Shape<T>([`color("${c}")`, ...this.src.map(indent)]);
  };

  tile(t: TileProps): Shape<T> {
    const times = t.times;
    if (t.times <= 0) {
      return this;
    } else {
      return this.union(
        this.tile({ ...t, times: times - 1 })
          .translate(t.translation));
    }
  }
}


export type ExtrudeProps = FProp<{
  height: number,
  center?: boolean,
  convexity?: number,
  twist?: number,
  slices?: number,
  scale?: number,
}>;

export type RotateExtrudeProps = FProp<{
  angle?: number,
  convexity?: number
}>;

export class Shape2 extends Shape<{ dim: 2 }> {
  dim: 2; // added to ensure that Shape2 and Shape3 do not fit

  linear_extrude(p: ExtrudeProps) {
    return new Shape3([`linear_extrude(${serialize(p)})`, ...this.src.map(indent)]);
  }

  rotate_extrude(p: RotateExtrudeProps) {
    return new Shape3([`rotate_extrude(${serialize(p)})`, ...this.src.map(indent)]);
  }
}

export class Shape3 extends Shape<{ dim: 3 }> {
  dim: 3; // added to ensure that Shape2 and Shape3 do not fit
}