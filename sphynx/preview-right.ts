import { options, parameters } from "./options";
import { Sphynx, init } from "./Sphynx";
import { model } from "./case-right";

init();

export const main = model
  .buildCase(model.singleKeyhole())
  .color("SlateGray")
  .union(
    ...[
      model
        .buildPlate()
        .translate([0, 0, -options.plateThickness])
        .color("Silver"),
      model.USBHolder().color("Azure"),
      model.preview(),
    ]
  );
