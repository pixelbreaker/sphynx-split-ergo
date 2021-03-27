type Props = {
  $fn?: number;
  $fa?: number;
  $fs?: number;
}

type FProp<T> = T & Props;

type Shape<T = unknown> = T & {
  src: string;
  translate: (p: Vec3) => Shape<T>;
  rotate: (p: Vec3) => Shape<T>;
  mirror: (p: Vec3) => Shape<T>;
  color: (c: string) => Shape<T>;
};

type Shape3 = Shape<{ dim: 3 }>;
type Shape2 = Shape<{ dim: 2 }>;

type Vec2 = [number, number];
type Vec3 = [number, number, number];
