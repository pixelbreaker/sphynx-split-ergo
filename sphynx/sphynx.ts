import {
  Options,
  Parameters,
  buildOptions,
  options,
  parameters,
} from "./options";
import { cube, cylinder, sphere } from "../src/csg/primitives";
import { deg2rad } from "../src/math";
import { importModel, importShape } from "../src/csg/primitives";
import { Shape3 } from "../src/csg/base3";
import { Vec3 } from "../src/csg/base";
import { V3 } from "../src/math";
import { partition } from "./utils";
const { add, rotateX, rotateY, rotateZ } = V3;

export const init = (overrides: Partial<Options> = undefined) => {
  buildOptions({
    columns: 5,
    rows: 3,
    caseRimDrop: 2,
    caseSpacing: 2,
    // tentingAngle: 30,
    // zOffset: 20,
    switchSpacing: "mx",
    switchStyle: "mx",
    keycapStyle: "sa",
    trackpad: true,
    encoder: false,
    mcuHolder: "elite-c",
    ...overrides,
  } as Options);
};

init(); // build options globally

type Posts = { tr: Shape3; tl: Shape3; br: Shape3; bl: Shape3 };
export class Sphynx {
  readonly settings: { o: Options; p: Parameters };
  posts: { [key: string]: Posts };

  // key spacing opts
  readonly postSize = 0.1;
  // readonly postOffset = { x: this.postSize / 2, y: this.postSize / 2 };
  readonly sphereSize;
  readonly sphereQuality = 12;
  readonly postOffset: { x: number; y: number };
  readonly sphereOffset: { x: number; y: number };
  readonly thumbSphereOffset: { x: number; y: number };
  readonly webRim: Shape3;
  readonly thumbSphere: Shape3;
  readonly webSphere: Shape3;
  readonly trackpadOffsetX = 2;

  static getColumnOffsets(column: number): Vec3 {
    const offsets: Vec3[] = [
      [0, 0.8, 0], // index inner
      [0, 0.2, 0], // index
      [1, 3, -2.5], // middle
      [1.6, -1.5, -0.5], // ring
      [1.4, -12.5, 2], // pinky
    ];

    return offsets[Math.min(Math.max(column, 0), offsets.length - 1)];
  }

  static getColumnSplay(column: number): number {
    const splays = [
      -1, // inner index
      -0.5, // index
      0, // middle
      4, // ring
      8, // pinky
    ];
    return -splays[Math.min(Math.max(column, 0), splays.length - 1)];
  }

  constructor(o: Options, p: Parameters) {
    this.settings = { o, p };
    this.sphereSize = o.webThickness;

    // set up some reusable objects
    this.postOffset = { x: this.postSize / 2, y: this.postSize / 2 };
    this.sphereOffset = { x: o.caseSpacing, y: o.caseSpacing };
    this.thumbSphereOffset = { x: -o.caseSpacing - 1, y: -o.caseSpacing - 1 };

    this.webRim = sphere({
      d: this.sphereSize * 1.5,
      $fn: this.sphereQuality,
    }).translate([0, 0, this.sphereSize / -2 + o.webThickness - o.caseRimDrop]);

    this.thumbSphere = sphere({
      d: this.sphereSize * 1.5,
      $fn: this.sphereQuality,
    }).translate([0, 0, this.sphereSize / -2 + o.webThickness - o.caseRimDrop]);

    this.webSphere = sphere({
      d: this.sphereSize,
      $fn: this.sphereQuality,
    }).translate([0, 0, this.sphereSize / -2 + o.webThickness]);

    this.makePosts();
  }

  filledKeyhole(): Shape3 {
    const { o, p } = this.settings;
    return cube([p.mountWidth, p.mountHeight, o.webThickness]).translate([
      0,
      0,
      o.webThickness / 2,
    ]);
  }

  singleKeyhole(): Shape3 {
    const { o, p } = this.settings;
    let tabThickness = 1.32;
    let tabHeight = 1.5;
    switch (o.switchStyle) {
      case "mx":
        // tabThickness
        tabHeight = 2;
        return cube([p.mountWidth, p.mountHeight, o.webThickness])
          .translate([0, 0, o.webThickness / 2])
          .difference(
            cube([p.keyholeWidth, p.keyholeHeight, o.webThickness + 4]),
            cube([3, p.keyholeHeight + tabThickness, o.webThickness]).translate(
              [0, 0, o.webThickness - tabHeight]
            )
          );
      case "choc":
      default:
        return cube([p.mountWidth, p.mountHeight, o.webThickness])
          .translate([0, 0, o.webThickness / 2])
          .difference(
            cube([p.keyholeWidth, p.keyholeHeight, o.webThickness + 4]),
            cube([
              p.keyholeWidth + tabThickness,
              p.keyholeHeight - 2,
              o.webThickness,
            ])
              .union(
                cube([
                  p.keyholeWidth - 2,
                  p.keyholeHeight + tabThickness,
                  o.webThickness,
                ])
              )
              .translate([0, 0, o.webThickness / 2 - tabHeight])
          );
    }
  }

  singleKeycap(row: number) {
    const { o, p } = this.settings;
    return importModel(
      `../models/${o.keycapStyle}${o.keycapStyle === "sa" ? row + 1 : ""}.stl`
    ).translate([0, 0, 4]);
  }

  // Placement
  keyPlace(column: number, row: number, shape: Shape3) {
    const { o, p } = this.settings;
    const columnAngle = p.curveRow * (o.centerColumn - column);

    return shape
      .translate([0, 0, -p.radiusRow])
      .rotate([p.curveColumn * (o.centerRow - row), 0, 0])
      .translate([0, 0, p.radiusRow - p.radiusColumn])
      .rotate([0, columnAngle, Sphynx.getColumnSplay(column)])
      .translate([0, 0, p.radiusColumn])
      .translate(Sphynx.getColumnOffsets(column))
      .rotate([0, o.tentingAngle, 0])
      .translate([0, 0, o.zOffset - (column > 2 && row >= o.rows ? 0.5 : 0)]);
  }

  positionRelativeToKey(column: number, row: number, shape: Shape3) {
    const { o, p } = this.settings;
    const columnAngle = p.curveRow * (o.centerColumn - column);

    return this.keyPlace(
      column,
      row,
      shape
        .rotate([-p.curveColumn * (o.centerRow - row), 0, 0])
        .rotate([0, -columnAngle, Sphynx.getColumnSplay(column)])
        .rotate([0, -o.tentingAngle, 0])
    );
  }

  getKeyPosition(column: number, row: number) {
    const { o, p } = this.settings;
    let position: Vec3 = [0, 0, 0];

    const columnAngle = p.curveRow * (o.centerColumn - column);
    position = rotateX(-p.curveColumn * (o.centerRow - row), position);
    position = rotateY(-columnAngle, position);
    position = rotateY(-o.tentingAngle, position);
    position = add(position, [0, 0, -p.radiusRow]);
    position = rotateX(p.curveColumn * (o.centerRow - row), position);
    position = add(position, [0, 0, p.radiusRow - p.radiusColumn]);
    position = rotateY(columnAngle, position);
    position = rotateZ(Sphynx.getColumnSplay(column), position);
    position = add(position, [0, 0, p.radiusColumn]);
    position = add(position, Sphynx.getColumnOffsets(column));
    position = rotateY(o.tentingAngle, position);
    position = add(position, [0, 0, o.zOffset]);

    return position;
  }

  placeKeys(shape: Shape3 | ((row: number) => Shape3)) {
    const { o, p } = this.settings;
    const keys = [];
    for (let i = 0; i < o.columns; i++) {
      for (let j = 0; j < o.rows; j++) {
        let key =
          typeof shape === "function"
            ? (shape(j) as Shape3)
            : (shape as Shape3);
        keys.push(this.keyPlace(i, j, key));
      }
    }

    const [firstKey, ...restKeys] = keys;
    return firstKey.union(...restKeys);
  }

  buildWall(start: Shape3, end: Shape3) {
    const edge = start.hull(end);
    return edge
      .projection()
      .linear_extrude({ height: 1, center: false })
      .hull(edge);
  }

  // Thumb keys
  placeThumb(rot: Vec3, move: Vec3, shape: Shape3) {
    const { o, p } = this.settings;
    return this.positionRelativeToKey(
      1,
      o.rows - 1,
      shape.rotate(rot).translate(move)
    )
      .translate(o.thumbOffsets)
      .translate([p.mountWidth / 2, -p.mountHeight / 2, 0]);
  }

  thumbRPlace(shape: Shape3): Shape3 {
    const { o, p } = this.settings;
    return this.placeThumb(
      o.trackpad ? [18, -5, -20] : o.encoder ? [0, 1, -6] : [11.5, -26, 10], // rotation
      o.trackpad
        ? [-3, -19, -1]
        : o.encoder
        ? [-10, -13, -3]
        : [-15, -10.3, -1], // translation
      shape
    );
  }

  thumbMPlace(shape: Shape3): Shape3 {
    return this.placeThumb([9, -12.5, 23], [-34.8, -16.2, -7.8], shape);
  }

  thumbLPlace(shape: Shape3): Shape3 {
    return this.placeThumb([8, 0, 33], [-54, -26, -10], shape);
  }

  placeThumbs(
    shape: Shape3 | ((row: number) => Shape3),
    ignoreRThumbWithAccessory: boolean = false
  ): Shape3 {
    const { o, p } = this.settings;
    let key =
      typeof shape === "function" ? (shape(2) as Shape3) : (shape as Shape3);
    return this.thumbLPlace(key).union(
      ...[
        this.thumbMPlace(key),
        ...((!(o.trackpad || o.encoder) || !ignoreRThumbWithAccessory) && [
          this.thumbRPlace(key),
        ]),
      ]
    );
  }

  // Utility shapes
  // const webThickness = 2;

  getWebPost(
    pos: "TL" | "TR" | "BL" | "BR",
    shape: Shape3,
    offset: { x: number; y: number } = this.postOffset
  ) {
    const { o, p } = this.settings;
    const [y, x] = pos.split("");

    return shape.translate([
      x === "L" ? p.mountWidth / -2 + offset.x : p.mountWidth / 2 - offset.x,
      y === "T" ? p.mountHeight / 2 - offset.y : p.mountHeight / -2 + offset.y,
      0,
    ]);
  }

  getPosts(
    shape: Shape3,
    offset: { x: number; y: number } = this.postOffset
  ): Posts {
    return {
      tr: this.getWebPost("TR", shape, offset),
      tl: this.getWebPost("TL", shape, offset),
      br: this.getWebPost("BR", shape, offset),
      bl: this.getWebPost("BL", shape, offset),
    };
  }

  makePosts() {
    const { o, p } = this.settings;

    this.posts = {
      post: this.getPosts(this.webSphere),
      rim: this.getPosts(this.webRim, this.sphereOffset),
      thumb: this.getPosts(this.thumbSphere, this.thumbSphereOffset),
    };
  }

  // Main key connectors

  triangleHulls(...args: Shape3[]) {
    const validArgs = args.filter((value) => value !== null);
    const triGroups = partition<Shape3>(validArgs, 3, 1);
    const shapes: Shape3[] = [];
    triGroups.forEach(([first, ...rest]) => {
      shapes.push(first.hull(...rest)); // hull here
    });
    const [first, ...rest] = shapes;
    return first.union(...rest);
  }

  keyConnectors() {
    const { o, p } = this.settings;
    const connectors: Shape3[] = [];

    // rows
    for (let col = -1; col < o.columns; col++) {
      for (let row = 0; row < o.rows; row++) {
        connectors.push(
          this.triangleHulls(
            this.keyPlace(col + 1, row, this.posts.post.tl),
            this.keyPlace(col, row, this.posts.post.tr),
            this.keyPlace(col + 1, row, this.posts.post.bl),
            this.keyPlace(col, row, this.posts.post.br)
          )
        );
      }
    }

    // columns
    for (let col = 0; col < o.columns; col++) {
      for (let row = -1; row < o.rows; row++) {
        connectors.push(
          this.triangleHulls(
            this.keyPlace(col, row, this.posts.post.bl),
            this.keyPlace(col, row, this.posts.post.br),
            this.keyPlace(col, row + 1, this.posts.post.tl),
            this.keyPlace(col, row + 1, this.posts.post.tr)
          )
        );
      }
    }

    // corners
    for (let col = -1; col < o.columns; col++) {
      for (let row = -1; row < o.rows; row++) {
        connectors.push(
          this.triangleHulls(
            this.keyPlace(col, row, this.posts.post.br),
            this.keyPlace(col, row + 1, this.posts.post.tr),
            this.keyPlace(col + 1, row, this.posts.post.bl),
            this.keyPlace(col + 1, row + 1, this.posts.post.tl)
          )
        );
      }
    }
    const [first, ...rest] = connectors;
    return first.union(...rest);
  }

  thumbConnectors = () => {
    const { o, p } = this.settings;
    const connectors = [];
    // between thumb keys
    connectors.push(
      this.triangleHulls(
        this.thumbMPlace(this.posts.post.tr),
        this.thumbMPlace(this.posts.post.br),
        this.thumbRPlace(this.posts.post.tl),
        this.thumbRPlace(this.posts.post.bl)
      )
    );
    connectors.push(
      this.triangleHulls(
        this.thumbLPlace(this.posts.post.tr),
        this.thumbLPlace(this.posts.post.br),
        this.thumbMPlace(this.posts.post.tl),
        this.thumbMPlace(this.posts.post.bl)
      )
    );

    // direct to main body
    // middle thumb to col 0
    connectors.push(
      this.triangleHulls(
        this.keyPlace(-1, o.rows, this.posts.post.tr),
        this.keyPlace(-1, o.rows - 1, this.posts.rim.br),
        this.thumbLPlace(this.posts.thumb.tr)
      )
    );
    connectors.push(
      this.triangleHulls(
        this.keyPlace(-1, o.rows, this.posts.post.tr),
        // this.keyPlace(-1, o.rows - 1, this.posts.rim.br),
        this.thumbLPlace(this.posts.thumb.tr),
        this.thumbMPlace(this.posts.post.tl)
      )
    );
    connectors.push(
      this.triangleHulls(
        this.thumbMPlace(this.posts.post.tl),
        this.keyPlace(-1, o.rows, this.posts.post.tr),
        this.thumbMPlace(this.posts.post.tr),
        this.keyPlace(0, o.rows, this.posts.post.tl),
        this.keyPlace(0, o.rows, this.posts.post.tr)
      )
    );

    // right thumb
    connectors.push(
      this.triangleHulls(
        this.thumbRPlace(this.posts.post.tl),
        this.thumbMPlace(this.posts.post.tr),
        this.keyPlace(1, o.rows, this.posts.post.tl),
        this.keyPlace(0, o.rows, this.posts.post.tr)
      )
    );
    connectors.push(
      this.triangleHulls(
        this.thumbRPlace(this.posts.post.tl),
        this.thumbRPlace(this.posts.post.tr),
        this.keyPlace(1, o.rows, this.posts.post.tl),
        this.keyPlace(1, o.rows, this.posts.post.tr)
      )
    );

    connectors.push(
      this.triangleHulls(
        this.thumbRPlace(this.posts.thumb.br),
        this.thumbRPlace(this.posts.post.tr),
        this.keyPlace(3, o.rows, this.posts.rim.tl),
        this.keyPlace(3, o.rows, this.posts.post.tl)
      )
    );
    if (!o.encoder) {
      connectors.push(
        this.triangleHulls(
          this.thumbRPlace(this.posts.post.tr),
          this.keyPlace(3, o.rows, this.posts.post.tl),
          this.keyPlace(1, o.rows, this.posts.post.tr),
          this.keyPlace(2, o.rows, this.posts.post.tr),
          this.keyPlace(2, o.rows, this.posts.post.tl)
        )
      );
    } else {
      connectors.push(
        this.triangleHulls(
          this.thumbRPlace(this.posts.post.tr),
          this.keyPlace(3, o.rows, this.posts.post.tl),
          this.keyPlace(2, o.rows, this.posts.post.tr)
        )
      );

      connectors.push(
        this.triangleHulls(
          this.thumbRPlace(this.posts.post.tr),
          this.keyPlace(2, o.rows, this.posts.post.tl),
          this.keyPlace(1, o.rows, this.posts.post.tr)
        )
      );

      connectors.push(
        this.triangleHulls(
          this.thumbRPlace(this.posts.post.tr),
          this.keyPlace(2, o.rows, this.posts.post.tl),
          this.keyPlace(2, o.rows, this.posts.post.tr)
        )
      );
    }

    const [first, ...rest] = connectors;
    return first.union(...rest);
  };

  thumbRim() {
    const connectors = [];
    // between thumb keys
    connectors.push(
      this.triangleHulls(
        this.thumbMPlace(this.posts.post.tl),
        this.thumbLPlace(this.posts.post.tr),
        this.thumbLPlace(this.posts.thumb.tr)
      )
    );

    connectors.push(
      this.triangleHulls(
        this.thumbLPlace(this.posts.post.tl),
        this.thumbLPlace(this.posts.post.tr),
        this.thumbLPlace(this.posts.thumb.tl),
        this.thumbLPlace(this.posts.thumb.tr)
      )
    );

    connectors.push(
      this.triangleHulls(
        this.thumbLPlace(this.posts.post.tl),
        this.thumbLPlace(this.posts.post.bl),
        this.thumbLPlace(this.posts.thumb.tl),
        this.thumbLPlace(this.posts.thumb.bl)
      )
    );

    connectors.push(
      this.triangleHulls(
        this.thumbLPlace(this.posts.post.br),
        this.thumbLPlace(this.posts.post.bl),
        this.thumbLPlace(this.posts.thumb.br),
        this.thumbLPlace(this.posts.thumb.bl)
      )
    );

    connectors.push(
      this.triangleHulls(
        this.thumbLPlace(this.posts.post.br),
        this.thumbMPlace(this.posts.post.bl),
        this.thumbLPlace(this.posts.thumb.br)
      )
    );

    connectors.push(
      this.triangleHulls(
        this.thumbMPlace(this.posts.post.bl),
        this.thumbLPlace(this.posts.thumb.br),
        this.thumbMPlace(this.posts.post.br),
        this.thumbMPlace(this.posts.thumb.br)
      )
    );

    connectors.push(
      this.triangleHulls(
        this.thumbMPlace(this.posts.post.br),
        this.thumbRPlace(this.posts.post.bl),
        this.thumbMPlace(this.posts.thumb.br)
      )
    );

    connectors.push(
      this.triangleHulls(
        this.thumbRPlace(this.posts.post.bl),
        this.thumbMPlace(this.posts.thumb.br),
        this.thumbRPlace(this.posts.post.br),
        this.thumbRPlace(this.posts.thumb.br)
      )
    );

    connectors.push(
      this.triangleHulls(
        this.thumbRPlace(this.posts.post.tr),
        this.thumbRPlace(this.posts.post.br),
        this.thumbRPlace(this.posts.thumb.br)
      )
    );

    const [first, ...rest] = connectors;
    return first.union(...rest);
  }

  thumbWalls() {
    const { o, p } = this.settings;
    const walls = [];
    walls.push(
      this.buildWall(
        this.thumbLPlace(this.posts.thumb.tr),
        this.thumbLPlace(this.posts.thumb.tl)
      )
    );
    walls.push(
      this.buildWall(
        this.thumbLPlace(this.posts.thumb.tl),
        this.thumbLPlace(this.posts.thumb.bl)
      )
    );
    walls.push(
      this.buildWall(
        this.thumbLPlace(this.posts.thumb.bl),
        this.thumbLPlace(this.posts.thumb.br)
      )
    );
    walls.push(
      this.buildWall(
        this.thumbLPlace(this.posts.thumb.br),
        this.thumbMPlace(this.posts.thumb.br)
      )
    );
    walls.push(
      this.buildWall(
        this.thumbMPlace(this.posts.thumb.br),
        this.thumbRPlace(this.posts.thumb.br)
      )
    );
    walls.push(
      this.buildWall(
        this.thumbRPlace(this.posts.thumb.br),
        this.keyPlace(3, o.rows, this.posts.rim.tl)
      )
    );

    const [first, ...rest] = walls;
    return first.union(...rest);
  }

  // Rims & Walls
  leftRim() {
    const { o, p } = this.settings;

    const rimHulls = [];
    for (let row = -1; row < o.rows; row++) {
      rimHulls.push(
        this.triangleHulls(
          this.keyPlace(-1, row, this.posts.rim.br),
          row < o.rows - 1
            ? this.keyPlace(-1, row + 1, this.posts.rim.tr)
            : null,
          this.keyPlace(-1, row, this.posts.post.br),
          this.keyPlace(-1, row + 1, this.posts.post.tr)
        )
      );
      if (row >= 0) {
        rimHulls.push(
          this.triangleHulls(
            this.keyPlace(-1, row, this.posts.post.tr),
            this.keyPlace(-1, row, this.posts.rim.tr),
            this.keyPlace(-1, row, this.posts.post.br),
            this.keyPlace(-1, row, this.posts.rim.br)
          )
        );
      }
    }

    const [first, ...rest] = rimHulls;
    return first.union(...rest);
  }

  leftWall() {
    const { o, p } = this.settings;

    const walls = [];
    for (let row = -1; row < o.rows; row++) {
      if (row < o.rows - 1) {
        walls.push(
          this.buildWall(
            this.keyPlace(-1, row, this.posts.rim.br),
            this.keyPlace(-1, row + 1, this.posts.rim.tr)
          )
        );
      }
      if (row >= 0) {
        walls.push(
          this.buildWall(
            this.keyPlace(-1, row, this.posts.rim.tr),
            this.keyPlace(-1, row, this.posts.rim.br)
          )
        );
      }
    }

    // thumb to left wall extra wall panel
    walls.push(
      this.buildWall(
        this.thumbLPlace(this.posts.thumb.tr),
        this.keyPlace(-1, o.rows - 1, this.posts.rim.br)
      )
    );

    const [first, ...rest] = walls;
    return first.union(...rest);
  }

  topRim() {
    const { o, p } = this.settings;
    const rimHulls = [];

    let pOffset = 0;
    let pDiff = 0;
    for (let col = -1; col < o.columns; col++) {
      const offset = Sphynx.getColumnOffsets(col + 1)[2];
      const diff = offset - pOffset;
      const sphX = this.sphereOffset.x;

      const xR = Math.abs(diff) !== 0 ? (diff < 0 ? -sphX : sphX) : sphX;
      const xL = Math.abs(diff) !== 0 ? (diff > 0 ? -sphX : sphX) : sphX;
      const pR = Math.abs(pDiff) !== 0 ? (pDiff < 0 ? -sphX : sphX) : sphX;
      const pL = Math.abs(pDiff) !== 0 ? (pDiff > 0 ? -sphX : sphX) : sphX;

      const offsetR = { ...this.sphereOffset, x: xR };
      const offsetL = { ...this.sphereOffset, x: xL };
      const pOffsetR = { ...this.sphereOffset, x: pR };

      rimHulls.push(
        this.triangleHulls(
          this.keyPlace(col, -1, this.getWebPost("BR", this.webRim, offsetL)),
          this.keyPlace(col, -1, this.posts.post.br),
          this.keyPlace(
            col + 1,
            -1,
            this.getWebPost("BL", this.webRim, offsetR)
          ),
          this.keyPlace(col + 1, -1, this.posts.post.bl)
        )
      );
      if (col >= 0) {
        rimHulls.push(
          this.triangleHulls(
            this.keyPlace(
              col,
              -1,
              this.getWebPost("BL", this.webRim, pOffsetR)
            ),
            this.keyPlace(col, -1, this.getWebPost("BR", this.webRim, offsetL)),
            this.keyPlace(col, -1, this.posts.post.bl),
            this.keyPlace(col, -1, this.posts.post.br)
          )
        );
      }
      pOffset = offset;
      pDiff = diff;
    }

    const [first, ...rest] = rimHulls;
    return first.union(...rest);
  }

  topWall() {
    const { o, p } = this.settings;
    const walls = [];

    let pOffset = 0;
    let pDiff = 0;
    for (let col = -1; col < o.columns; col++) {
      const offset = Sphynx.getColumnOffsets(col + 1)[2];
      const diff = offset - pOffset;
      const sphX = this.sphereOffset.x;

      const xR = Math.abs(diff) !== 0 ? (diff < 0 ? -sphX : sphX) : sphX;
      const xL = Math.abs(diff) !== 0 ? (diff > 0 ? -sphX : sphX) : sphX;
      const pR = Math.abs(pDiff) !== 0 ? (pDiff < 0 ? -sphX : sphX) : sphX;
      const pL = Math.abs(pDiff) !== 0 ? (pDiff > 0 ? -sphX : sphX) : sphX;

      const offsetR = { ...this.sphereOffset, x: xR };
      const offsetL = { ...this.sphereOffset, x: xL };
      const pOffsetR = { ...this.sphereOffset, x: pR };

      walls.push(
        this.buildWall(
          this.keyPlace(col, -1, this.getWebPost("BR", this.webRim, offsetL)),
          this.keyPlace(
            col + 1,
            -1,
            this.getWebPost("BL", this.webRim, offsetR)
          )
        )
      );
      if (col >= 0) {
        walls.push(
          this.buildWall(
            this.keyPlace(
              col,
              -1,
              this.getWebPost("BL", this.webRim, pOffsetR)
            ),
            this.keyPlace(col, -1, this.getWebPost("BR", this.webRim, offsetL))
          )
        );
      }
      pOffset = offset;
      pDiff = diff;
    }

    const [first, ...rest] = walls;
    return first.union(...rest);
  }

  rightRim() {
    const { o, p } = this.settings;
    const rimHulls = [];
    for (let row = -1; row < o.rows; row++) {
      rimHulls.push(
        this.triangleHulls(
          this.keyPlace(o.columns, row, this.posts.rim.bl),
          this.keyPlace(o.columns, row + 1, this.posts.rim.tl),
          this.keyPlace(o.columns, row, this.posts.post.bl),
          this.keyPlace(o.columns, row + 1, this.posts.post.tl)
        )
      );
      if (row >= 0) {
        rimHulls.push(
          this.triangleHulls(
            this.keyPlace(o.columns, row, this.posts.post.tl),
            this.keyPlace(o.columns, row, this.posts.rim.tl),
            this.keyPlace(o.columns, row, this.posts.post.bl),
            this.keyPlace(o.columns, row, this.posts.rim.bl)
          )
        );
      }
    }

    const [first, ...rest] = rimHulls;
    return first.union(...rest);
  }

  rightWall() {
    const { o, p } = this.settings;
    const walls = [];
    for (let row = -1; row < o.rows; row++) {
      walls.push(
        this.buildWall(
          this.keyPlace(o.columns, row, this.posts.rim.bl),
          this.keyPlace(o.columns, row + 1, this.posts.rim.tl)
        )
      );
      if (row >= 0) {
        walls.push(
          this.buildWall(
            this.keyPlace(o.columns, row, this.posts.rim.bl),
            this.keyPlace(o.columns, row, this.posts.rim.tl)
          )
        );
      }
    }

    const [first, ...rest] = walls;
    return first.union(...rest);
  }

  bottomRim() {
    const { o, p } = this.settings;
    const rimHulls = [];

    let pOffset = 0;
    let pDiff = 0;
    const sphX = this.sphereOffset.x;

    for (let col = o.columns - 1; col >= 3; col--) {
      const offset = Sphynx.getColumnOffsets(col)[2];
      const diff = offset - pOffset;

      const xR = Math.abs(diff) !== 0 ? (diff > 0 ? -sphX : sphX) : sphX;
      const xL = Math.abs(diff) !== 0 ? (diff < 0 ? -sphX : sphX) : sphX;
      const pR = Math.abs(pDiff) !== 0 ? (pDiff < 0 ? -sphX : sphX) : -sphX;
      const pL = Math.abs(pDiff) !== 0 ? (pDiff > 0 ? sphX : -sphX) : -sphX;

      const offsetR = { ...this.sphereOffset, x: xR };
      const offsetL = { ...this.sphereOffset, x: xL };
      const pOffsetR = { ...this.sphereOffset, x: pR };
      const pOffsetL = { ...this.sphereOffset, x: pL };

      rimHulls.push(
        this.triangleHulls(
          this.keyPlace(
            col,
            o.rows,
            this.getWebPost("TR", this.webRim, offsetR)
          ),
          this.keyPlace(col, o.rows, this.posts.post.tr),
          this.keyPlace(
            col + 1,
            o.rows,
            this.getWebPost("TL", this.webRim, offsetL)
          ),
          this.keyPlace(col + 1, o.rows, this.posts.post.tl)
        )
      );
      if (col >= 0) {
        rimHulls.push(
          this.triangleHulls(
            this.keyPlace(
              col,
              o.rows,
              this.getWebPost("TL", this.webRim, pOffsetL)
            ),
            this.keyPlace(
              col,
              o.rows,
              this.getWebPost("TR", this.webRim, pOffsetR)
            ),
            this.keyPlace(col, o.rows, this.posts.post.tl),
            this.keyPlace(col, o.rows, this.posts.post.tr)
          )
        );
      }
      pOffset = offset;
      pDiff = diff;
    }

    const [first, ...rest] = rimHulls;
    return first.union(...rest);
  }

  bottomWall() {
    const { o, p } = this.settings;
    const walls = [];

    let pOffset = 0;
    let pDiff = 0;
    const sphX = this.sphereOffset.x;

    for (let col = o.columns - 1; col >= 3; col--) {
      const offset = Sphynx.getColumnOffsets(col)[2];
      const diff = offset - pOffset;

      const xR = Math.abs(diff) !== 0 ? (diff > 0 ? -sphX : sphX) : sphX;
      const xL = Math.abs(diff) !== 0 ? (diff < 0 ? -sphX : sphX) : sphX;
      const pR = Math.abs(pDiff) !== 0 ? (pDiff < 0 ? -sphX : sphX) : -sphX;
      const pL = Math.abs(pDiff) !== 0 ? (pDiff > 0 ? sphX : -sphX) : -sphX;

      const offsetR = { ...this.sphereOffset, x: xR };
      const offsetL = { ...this.sphereOffset, x: xL };
      const pOffsetR = { ...this.sphereOffset, x: pR };
      const pOffsetL = { ...this.sphereOffset, x: pL };

      walls.push(
        this.buildWall(
          this.keyPlace(
            col,
            o.rows,
            this.getWebPost("TR", this.webRim, offsetR)
          ),
          this.keyPlace(
            col + 1,
            o.rows,
            this.getWebPost("TL", this.webRim, offsetL)
          )
        )
      );
      if (col >= 0) {
        walls.push(
          this.buildWall(
            this.keyPlace(
              col,
              o.rows,
              this.getWebPost("TL", this.webRim, pOffsetL)
            ),
            this.keyPlace(
              col,
              o.rows,
              this.getWebPost("TR", this.webRim, pOffsetR)
            )
          )
        );
      }
      pOffset = offset;
      pDiff = diff;
    }

    const [first, ...rest] = walls;
    return first.union(...rest);
  }

  caseWalls() {
    return this.leftWall().union(
      this.topWall(),
      this.rightWall(),
      this.bottomWall(),
      this.thumbWalls()
    );
  }

  caseRim = () => {
    return this.leftRim().union(
      this.topRim(),
      this.rightRim(),
      this.bottomRim(),
      this.thumbRim()
    );
  };

  USBHolder() {
    const { o, p } = this.settings;
    const [x, y] = this.getKeyPosition(1, 0);
    return importModel(`../models/${o.mcuHolder}.stl`)
      .rotate([0, 0, Sphynx.getColumnSplay(1)]) // + getColumnSplay(1) / 2])
      .translate([x, y + (p.mountHeight - p.keyholeHeight) * 0.7, 0])
      .translate([
        -p.mountWidth / 2,
        p.mountHeight / 2 + o.caseSpacing + this.sphereSize + 0.5,
        0,
      ])
      .translate([o.mcuHolder === "rpi-pico" ? -1 : 0, 0, 0]);
  }

  USBHolderSpace() {
    return this.USBHolder()
      .projection()
      .linear_extrude({ height: 13.02, center: false })
      .translate([0, 0, -1])
      .union(cube([9, 6, 18]).translate([-44, 38, 8]));
  }

  previewKeycaps() {
    return this.placeKeys((row: number) => this.singleKeycap(row))
      .color("grey")
      .union(this.placeThumbs((row: number) => this.singleKeycap(row), true))
      .color("grey");
  }

  previewTrackpad() {
    return this.thumbRPlace(
      cylinder({ d: 40, h: 2, $fn: 70 }).translate([
        this.trackpadOffsetX,
        0,
        6.5,
      ])
    ).color("#222222");
  }

  previewEncoder() {
    return this.thumbRPlace(importModel("../models/encoder.stl"))
      .translate([0, 0, 3])
      .color("#222222");
  }

  preview() {
    const { o, p } = this.settings;
    return this.previewKeycaps().union(
      ...[
        ...(o.encoder && [this.previewEncoder()]),
        ...(o.trackpad && [this.previewTrackpad()]),
      ]
    );
  }

  trackpadInset() {
    return this.thumbRPlace(
      cylinder({ d: 41, h: 8, $fn: 50 }).translate([this.trackpadOffsetX, 0, 7])
    )
      .hull(
        this.thumbRPlace(this.posts.post.br).union(
          this.thumbRPlace(this.posts.post.bl),
          this.thumbRPlace(this.posts.post.tl),
          this.keyPlace(3, 3, this.posts.post.tl).translate([0, -2, 0]),
          this.keyPlace(2, 3, this.posts.post.tr).translate([0, -2, 0]),
          this.keyPlace(2, 3, this.posts.post.tl).translate([0, -2, 0])
        )
      )
      .union(
        this.thumbRPlace(
          cylinder({ d: 20, h: 60 })
            .translate([this.trackpadOffsetX - 3, 6, 0])
            .rotate([5, 0, 20])
        )
      );
    // .translate([0, 0, 5]);
  }

  trackpadOuter() {
    return this.thumbRPlace(
      cylinder({ d: 42, h: 4, $fn: 70 }).translate([this.trackpadOffsetX, 0, 3])
    ).hull(
      this.thumbRPlace(this.posts.thumb.br).union(
        this.thumbRPlace(this.posts.thumb.bl),
        this.thumbRPlace(this.posts.thumb.tl),
        this.keyPlace(3, 3, this.posts.rim.tl),
        this.keyPlace(2, 3, this.posts.post.tr),
        this.keyPlace(2, 3, this.posts.post.tl)
      )
      // .translate([0, 0, -5])
    );
  }

  trackpad(mirror: boolean = false) {
    const hullForm = this.trackpadOuter().difference(this.trackpadInset());

    return this.thumbRPlace(
      importModel("../models/cirque-40-flat.stl")
        .mirror([Number(mirror), 0, 0])
        .rotate([0, 0, 180])
        .translate([this.trackpadOffsetX, 0, 5])
    ).union(hullForm);
  }

  buildCase(keyhole: Shape3, mirror: boolean = false) {
    const { o, p } = this.settings;
    const models = [];
    if (o.trackpad) {
      models.push(this.trackpad(mirror));
    } else if (o.encoder) {
      models.push(
        this.thumbRPlace(importModel("../models/ec11.stl")).translate([
          0, -0.8, -2.5,
        ])
      );
    }

    return this.placeKeys(keyhole)
      .union(
        this.keyConnectors(),
        this.caseWalls().difference(this.USBHolderSpace()),
        this.caseRim(),
        this.placeThumbs(keyhole),
        this.thumbConnectors()
      )
      .difference(...[...(o.trackpad && [this.trackpadInset()])])
      .union(...models); // add models after cutting away
  }

  outline() {
    return this.placeKeys(this.filledKeyhole()).union(
      this.keyConnectors(),
      this.caseWalls().difference(this.USBHolderSpace()),
      this.caseRim(),
      this.placeThumbs(this.filledKeyhole()),
      this.thumbConnectors()
    );
  }

  buildPlate = () => {
    const { o, p } = this.settings;
    const shape = this.outline().projection();
    return shape
      .difference(
        shape
          .offset({ delta: -4 })
          .difference(
            importShape("../models/voronoi.dxf")
              .scale([0.25, 0.25, 1])
              .translate([-168, -85, 0])
          )
      )
      .linear_extrude({ height: o.plateThickness, center: false });
  };
}

const right = new Sphynx(options, parameters);

// export const main = right.buildCase(right.singleKeyhole());
// .union
// // USBHolder().debug()
// // previewKeycaps(),
// // previewTrackpad()
// // previewEncoder()
// ();
