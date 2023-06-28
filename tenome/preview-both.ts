import { main } from "./preview";

export const preview = main
  .translate([-100, 0, 0])
  .union(main.mirror([-1, 0, 0]).translate([100, 0, 0]));
