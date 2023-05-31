import { main as left } from "./case-left";
import { main as right } from "./case-right";

export const main = left
  .translate([-100, 0, 0])
  .union(right.translate([100, 0, 0]));
