import { circle, square, polygon } from "../../src/csg/primitives";
import { cube, cylinder, sphere, polyhedron } from "../../src/csg/primitives";
import { hole } from "../utils";
import { polyRound } from "../../src/csg/polyround";
import { buildOptions, options as o, parameters as p } from "./options";
import { singleKeyhole } from "./sphynx";

buildOptions({ switchStyle: "mx" });

export const main = singleKeyhole();
