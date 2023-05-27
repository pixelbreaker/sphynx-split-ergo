import { circle, square, polygon } from "../src/csg/primitives";
import { cube, cylinder, sphere, polyhedron } from "../src/csg/primitives";
import { hole } from "./utils";
import { polyRound } from "../src/csg/polyround";
import { buildOptions, options as o, parameters as p } from "./options";
import { USBHolderSpace, init, singleKeyhole } from "./sphynx";

buildOptions({ mcuHolder: "elite-c" });

export const main = USBHolderSpace();
