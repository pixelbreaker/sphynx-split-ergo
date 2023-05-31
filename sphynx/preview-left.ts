import { defaultOptions } from "./options";
import { model } from "./case-left";

export const main = model
  .buildCase(model.singleKeyhole(), true)
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
  )
  .mirror([1, 0, 0]);
