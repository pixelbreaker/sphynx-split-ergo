# Tenome (Te-no-meh 手の目) keyboard

Tenome is a parametric split ergonomic keyboard with columnar stagger and splay. It is fully configurable to adjust the shape to fit your hands. Cirque trackpads, or trackball/encoder holders using the opensource designs from BastardKB can also be added in place of the outer thumb key.

![Right side render](./img/choc-mx.jpg)

I have written this from scratch in TypeScript, but the code is heavily influenced by and sections ported from the Clojure:

- Josh Bertrand's [Dactyl Manuform](https://github.com/abstracthat/dactyl-manuform)
- Okke Formsma's [Dactyl Manuform Tight](https://github.com/okke-formsma/dactyl-manuform-tight/)

The layout is roughly based on Quentin Le Bastard's [Charybdis Nano](https://github.com/Bastardkb/Charybdis), which has been my daily driver for some time.

This repository is a fork of Richard Wang's [Openscad-ts](https://github.com/richardwa/openscad-ts). Thanks Richard, this has made modelling with TypeScript a really pleasant dev experience.

## Usage

1. Check out this project with `git clone git@github.com:pixelbreaker/tenome-split-ergo.git`
2. Run `npm install`
3. Run `npm start`
4. start editing files under `tenome`, scad files will output into `/target` folder
5. open openscad on the generated file
   - turn on "Automatic review and preview" mode
   - changes to the projects files will automatically propagate to openscad

## Accessories

Tenome is designed primarily to be used with a pointing device or rotary encoder on each side. A Cirque Pinnacle 40mm trackpad can be pressed directly into the case and supported with an [Accessory spacer](./stls/accessory-holder-spacer.stl).

Alternatively the opensource [Trackball](https://github.com/Bastardkb/Charybdis) or [Encoder](https://github.com/Bastardkb/Charybdis-EC11) mounts from Bastard Keyboards can be used.

## Wiring

The microcontroller should be mounted on the BastardKB [Elite-C holder](https://github.com/Bastardkb/Elite-C-holder).

### Attribution

Some of the 3D models used are from Thingiverse and under [Creative Commons Attribution License](https://creativecommons.org/licenses/by-nc/4.0/)

The models are:

- [MBK Choc keycaps](https://www.thingiverse.com/thing:4564253)
- [SA Keycaps](https://www.thingiverse.com/thing:4283287)
- [XDA Keycaps](https://www.thingiverse.com/thing:4593219/files)
