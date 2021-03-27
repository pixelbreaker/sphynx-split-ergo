type Props = {
  $fn?: number;
  $fa?: number;
  $fs?: number;
}

type FProp<T> = T & Props;
type Shape = { src: string };
type Shape3 = Shape & { dim: 3 };
type Shape2 = Shape & { dim: 2 };

type Vec2 = [number, number];
type Vec3 = [number, number, number];
