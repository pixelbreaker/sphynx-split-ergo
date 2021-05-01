export type Percent = string;
export type SlicerSettings = Partial<{
  'cut': number;
  'cut-x': number;
  'cut-y': number;
  'adaptive-slicing': number;
  'adaptive-slicing-quality': Percent;
  'avoid-crossing-perimeters': number;
  'bed-shape': string;
  'bed-temperature': number;
  'before-layer-gcode': string;
  'between-objects-gcode': string;
  'bottom-infill-pattern': 'rectilinear';
  'bottom-solid-layers': number;
  'bridge-acceleration': number;
  'bridge-fan-speed': number;
  'bridge-flow-ratio': number;
  'bridge-speed': number;
  'brim-connections-width': number;
  'brim-width': number;
  'compatible-printers': string;
  'complete-objects': number;
  'cooling': number;
  'default-acceleration': number;
  'disable-fan-first-layers': number;
  'dont-support-bridges': number;
  'duplicate-distance': number;
  'end-filament-gcode': string;
  'end-gcode': string;
  'external-perimeter-extrusion-width': number;
  'external-perimeter-speed': Percent;
  'external-perimeters-first': number;
  'extra-perimeters': number;
  'extruder-clearance-height': number;
  'extruder-clearance-radius': number;
  'extruder-offset': number;
  'extrusion-axis': number;
  'extrusion-multiplier': number;
  'extrusion-width': number;
  'fan-always-on': boolean;
  'fan-below-layer-time': number;
  'filament-colour': string;
  'filament-cost': number;
  'filament-density': number;
  'filament-diameter': string;
  'filament-max-volumetric-speed': number;
  'filament-notes': string;
  'filament-settings-id': number;
  'fill-angle': number;
  'fill-density': Percent;
  'fill-gaps': number;
  'fill-pattern': 'cubic';
  'first-layer-acceleration': number;
  'first-layer-bed-temperature': number;
  'first-layer-extrusion-width': number;
  'first-layer-height': number;
  'first-layer-speed': number;
  'first-layer-temperature': number;
  'gap-fill-speed': number;
  'gcode-arcs': number;
  'gcode-comments': number;
  'gcode-flavor': 'reprap';
  'has-heatbed': number;
  'host-type': 'octoprint';
  'infill-acceleration': number;
  'infill-every-layers': number;
  'infill-extruder': number;
  'infill-extrusion-width': number;
  'infill-first': number;
  'infill-only-where-needed': number;
  'infill-overlap': Percent;
  'infill-speed': number;
  'interface-shells': number;
  'interior-brim-width': number;
  'layer-gcode': string;
  'layer-height': number;
  'match-horizontal-surfaces': number;
  'max-fan-speed': number;
  'max-layer-height': number;
  'max-print-speed': number;
  'max-volumetric-speed': number;
  'min-fan-speed': number;
  'min-layer-height': number;
  'min-print-speed': number;
  'min-skirt-length': number;
  'notes': string;
  'nozzle-diameter': number;
  'octoprint-apikey': string;
  'only-retract-when-crossing-perimeters': number;
  'ooze-prevention': number;
  'output-filename-format': string;
  'overhangs': number;
  'perimeter-acceleration': number;
  'perimeter-extruder': number;
  'perimeter-extrusion-width': number;
  'perimeter-speed': number;
  'perimeters': number;
  'post-process': string;
  'pressure-advance': number;
  'print-host': string;
  'print-settings-id': string;
  'printer-notes': string;
  'printer-settings-id': string;
  'raft-layers': number;
  'regions-overlap': number;
  'resolution': number;
  'retract-before-travel': number;
  'retract-layer-change': number;
  'retract-length': number;
  'retract-length-toolchange': number;
  'retract-lift': number;
  'retract-lift-above': number;
  'retract-lift-below': number;
  'retract-restart-extra': number;
  'retract-restart-extra-toolchange': number;
  'retract-speed': number;
  'seam-position': 'aligned';
  'sequential-print-priority': number;
  'serial-port': string;
  'serial-speed': number;
  'shortcuts': 'support-material'
  'skirt-distance': number;
  'skirt-height': number;
  'skirts': number;
  'slowdown-below-layer-time': number;
  'small-perimeter-speed': number;
  'solid-infill-below-area': number;
  'solid-infill-every-layers': number;
  'solid-infill-extruder': number;
  'solid-infill-extrusion-width': number;
  'solid-infill-speed': number;
  'spiral-vase': number;
  'standby-temperature-delta': number;
  'start-filament-gcode': string;
  'start-gcode': string;
  'support-material': boolean;
  'support-material-angle': number;
  'support-material-buildplate-only': number;
  'support-material-contact-distance': number;
  'support-material-enforce-layers': number;
  'support-material-extruder': number;
  'support-material-extrusion-width': number;
  'support-material-interface-extruder': number;
  'support-material-interface-extrusion-width': number;
  'support-material-interface-layers': number;
  'support-material-interface-spacing': number;
  'support-material-interface-speed': Percent;
  'support-material-max-layers': number;
  'support-material-pattern': 'pillars';
  'support-material-spacing': number;
  'support-material-speed': number;
  'support-material-threshold': Percent;
  'temperature': number;
  'thin-walls': number;
  'threads': number;
  'toolchange-gcode': string;
  'top-infill-extrusion-width': number;
  'top-infill-pattern': 'rectilinear';
  'top-solid-infill-speed': number;
  'top-solid-layers': number;
  'travel-speed': number;
  'use-firmware-retraction': number;
  'use-relative-e-distances': number;
  'use-set-and-wait-bed': number;
  'use-set-and-wait-extruder': number;
  'use-volumetric-e': number;
  'vibration-limit': number;
  'wipe': number;
  'xy-size-compensation': number;
  'z-offset': number;
  'z-steps-per-mm': number;
}>;