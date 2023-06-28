import { defaultOptions } from "./options";
import { model } from "./case-left";

export const main = model.buildPlate().mirror([-1, 0, 0]).projection();
