import { buildOptions, defaultOptions } from "./options";
import { Sphynx } from "./Sphynx";

const { options: chocOptions, parameters: chocParameters } = buildOptions({
  ...defaultOptions,
  switchStyle: "choc",
});
const { options: mxOptions, parameters: mxParameters } = buildOptions({
  ...defaultOptions,
  switchStyle: "mx",
  switchSpacing: "mx",
  keycapStyle: "sa",
});

export const choc = new Sphynx(chocOptions);
export const mx = new Sphynx(mxOptions);

export const main = choc
  .singleKeyhole()
  .translate([-10, 0, -chocParameters.keyholeThickness])
  .mirror([0, 0, 1])
  .union(
    mx
      .singleKeyhole()
      .translate([10, 0, -mxParameters.keyholeThickness])
      .mirror([0, 0, 1])
  );
