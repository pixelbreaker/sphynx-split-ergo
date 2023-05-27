import { options } from "./options";
import { init } from "./Sphynx";
import { model } from "./case-left";
init();

export const main = model
  .buildCase(model.singleKeyhole(), true)
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
  )
  .mirror([1, 0, 0]);
