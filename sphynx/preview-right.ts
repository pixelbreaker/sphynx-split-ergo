import { defaultOptions } from "./options";
import { model } from "./case-right";

export const main = model
  .buildCase(model.singleKeyhole())
  .color("SlateGray")
  .union(
    ...[
      model
        .buildPlate()
        .translate([0, 0, -defaultOptions.plateThickness])
        .color("Silver"),
      model.USBHolder().color("Azure"),
      model.preview(),
    ]
  );
