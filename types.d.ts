type Props = {
  $fn?: number;
  $fa?: number;
  $fs?: number;
}

type FProp<T> = T & Props;
type Shape3 = { src3: string };
type Shape2 = { src2: string };

type Vec2 = [number, number];
type Vec3 = [number, number, number];
