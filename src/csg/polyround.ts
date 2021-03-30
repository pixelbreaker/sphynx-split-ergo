import { minus, cross, add, normalize, dot, scale } from "../math";
import { FProp, Vec2, Vec3 } from "./base";
import { Shape2 } from "./base2";
import { circle, CirleProps, polygon } from "./primitives";

const epsilon = 0.0001;
export type PolyProps = FProp<{ points: Vec2[], radius: number[] }>;
export const polyRound = (p: PolyProps): Shape2 => {

  let poly = polygon({ points: p.points });

  const len = p.points.length;
  for (let i = 0; i < len; i++) {
    const rad = p.radius[i % p.radius.length];
    if (!rad || rad < epsilon) {
      continue;
    }

    const curr = p.points[i];
    const prev = p.points[(i + len - 1) % len];
    const next = p.points[(i + 1) % len];

    const c = [...curr, 0] as Vec3;
    const a = normalize(minus([...prev, 0], c));
    const b = normalize(minus([...next, 0], c));

    const crossp = cross(a, b);
    if (Math.abs(crossp[2]) < epsilon) {
      // lines are colinear, we can ignore this point all together
      continue;
    }

    const bisector = normalize(add(a, b));
    const normal = normalize(cross(crossp, a));
    const d = rad / dot(bisector, normal);
    const dVec = scale(d, bisector);
    const center = add(dVec, c);
    const aVec = scale(dot(dVec, a), a);
    const bVec = scale(dot(dVec, b), b);
    const cirProp: CirleProps = {
      r: rad,
      $fn: p.$fn
    };
    const currentCorner = polygon({
      points: [
        [aVec[0] + curr[0], aVec[1] + curr[1]],
        curr,
        [bVec[0] + curr[0], bVec[1] + curr[1]]]
    });
    
    if (crossp[2] > 0) {
      // convex --- remove material
      poly = poly
        .difference(currentCorner)  //remove the corner
        .union(circle(cirProp)   // add back rounded corner
          .translate(center)
          .intersection(currentCorner));
    } else {
      // concave --- add material
      poly = poly.union(currentCorner
        .difference(
          circle(cirProp).translate(center)));
    }
  }

  return poly;

}