import {
  Options,
  buildOptions,
  options as o,
  parameters as p,
} from "./options";
import { cube, cylinder, sphere } from "../../src/csg/primitives";
import { deg2rad } from "../../src/math";
import { importModel, importShape } from "../../src/csg/primitives";
import { Shape3 } from "../../src/csg/base3";
import { Vec3 } from "../../src/csg/base";
import { V3 } from "../../src/math";
const { add, rotateX, rotateY, rotateZ } = V3;

export const init = () => {
  buildOptions({
    columns: 5,
    rows: 3,
    caseRimDrop: 2,
    caseSpacing: 2,
    // tentingAngle: 30,
    // zOffset: 20,
    switchSpacing: "choc",
    switchStyle: "choc",
    keycapStyle: "choc",
    trackpad: true,
    encoder: false,
    mcuHolder: "elite-c",
  });
};

init(); // build options globally

// Key holes
export const filledKeyhole = () =>
  cube([p.mountWidth, p.mountHeight, o.webThickness]).translate([
    0,
    0,
    o.webThickness / 2,
  ]);

export const singleKeyhole = (): Shape3 => {
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
          cube([3, p.keyholeHeight + tabThickness, o.webThickness]).translate([
            0,
            0,
            o.webThickness - tabHeight,
          ])
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
};

export const singleKeycap = (row: number) =>
  importModel(
    `../../models/${o.keycapStyle}${o.keycapStyle === "sa" ? row + 1 : ""}.stl`
  ).translate([0, 0, 4]);

const getColumnOffsets = (column: number): Vec3 => {
  const offsets: Vec3[] = [
    [0, 0.8, 0], // index inner
    [0, 0.2, 0], // index
    [1, 3, -2.5], // middle
    [1.6, -1.5, -0.5], // ring
    [1.4, -12.5, 2], // pinky
  ];

  return offsets[Math.min(Math.max(column, 0), offsets.length - 1)];
};

const getColumnSplay = (column: number): number => {
  const splays = [
    -1, // inner index
    -0.5, // index
    0, // middle
    4, // ring
    8, // pinky
  ];
  return -splays[Math.min(Math.max(column, 0), splays.length - 1)];
};

// Placement
const keyPlace = (column: number, row: number, shape: Shape3) => {
  const columnAngle = p.curveRow * (o.centerColumn - column);

  return shape
    .translate([0, 0, -p.radiusRow])
    .rotate([p.curveColumn * (o.centerRow - row), 0, 0])
    .translate([0, 0, p.radiusRow - p.radiusColumn])
    .rotate([0, columnAngle, getColumnSplay(column)])
    .translate([0, 0, p.radiusColumn])
    .translate(getColumnOffsets(column))
    .rotate([0, o.tentingAngle, 0])
    .translate([0, 0, o.zOffset - (column > 2 && row >= o.rows ? 0.5 : 0)]);
};

const positionRelativeToKey = (column: number, row: number, shape: Shape3) => {
  const columnAngle = p.curveRow * (o.centerColumn - column);

  return keyPlace(
    column,
    row,
    shape
      .rotate([-p.curveColumn * (o.centerRow - row), 0, 0])
      .rotate([0, -columnAngle, getColumnSplay(column)])
      .rotate([0, -o.tentingAngle, 0])
  );
};

const getKeyPosition = (column: number, row: number) => {
  let position: Vec3 = [0, 0, 0];

  const columnAngle = p.curveRow * (o.centerColumn - column);
  position = rotateX(-p.curveColumn * (o.centerRow - row), position);
  position = rotateY(-columnAngle, position);
  position = rotateY(-o.tentingAngle, position);
  position = add(position, [0, 0, -p.radiusRow]);
  position = rotateX(p.curveColumn * (o.centerRow - row), position);
  position = add(position, [0, 0, p.radiusRow - p.radiusColumn]);
  position = rotateY(columnAngle, position);
  position = rotateZ(getColumnSplay(column), position);
  position = add(position, [0, 0, p.radiusColumn]);
  position = add(position, getColumnOffsets(column));
  position = rotateY(o.tentingAngle, position);
  position = add(position, [0, 0, o.zOffset]);

  return position;
};

const placeKeys = (shape: Shape3 | ((row: number) => Shape3)) => {
  const keys = [];
  for (let i = 0; i < o.columns; i++) {
    for (let j = 0; j < o.rows; j++) {
      let key =
        typeof shape === "function" ? (shape(j) as Shape3) : (shape as Shape3);
      keys.push(keyPlace(i, j, key));
    }
  }

  const [firstKey, ...restKeys] = keys;
  return firstKey.union(...restKeys);
};

const buildWall = (start: Shape3, end: Shape3) => {
  const edge = start.hull(end);
  return edge
    .projection()
    .linear_extrude({ height: 1, center: false })
    .hull(edge);
};

// Thumb keys
const placeThumb = (rot: Vec3, move: Vec3, shape: Shape3) => {
  return positionRelativeToKey(1, o.rows - 1, shape.rotate(rot).translate(move))
    .translate(o.thumbOffsets)
    .translate([p.mountWidth / 2, -p.mountHeight / 2, 0]);
};

const thumbRPlace = (shape: Shape3): Shape3 =>
  placeThumb(
    o.trackpad ? [18, -5, -8] : o.encoder ? [0, 1, 10] : [11.5, -26, 10], // rotation
    o.trackpad ? [-3, -11, -1] : o.encoder ? [-10, -9, -7] : [-15, -10.3, -1], // translation
    shape
  );

const thumbMPlace = (shape: Shape3): Shape3 =>
  placeThumb([9, -12.5, 23], [-33.8, -16.2, -7.8], shape);

const thumbLPlace = (shape: Shape3): Shape3 =>
  placeThumb([8, 0, 33], [-52, -26, -10], shape);

const placeThumbs = (
  shape: Shape3 | ((row: number) => Shape3),
  ignoreRThumbWithAccessory: boolean = false
): Shape3 => {
  let key =
    typeof shape === "function" ? (shape(2) as Shape3) : (shape as Shape3);
  return thumbLPlace(key).union(
    ...[
      thumbMPlace(key),
      ...((!(o.trackpad || o.encoder) || !ignoreRThumbWithAccessory) && [
        thumbRPlace(key),
      ]),
    ]
  );
};

// Utility shapes
// const webThickness = 2;
const postSize = 0.1;
const sphereSize = o.webThickness;
const sphereQuality = 12;

const webRim = sphere({ d: sphereSize * 1.5, $fn: sphereQuality }).translate([
  0,
  0,
  sphereSize / -2 + o.webThickness - o.caseRimDrop,
]);
const thumbSphere = sphere({
  d: sphereSize * 1.5,
  $fn: sphereQuality,
}).translate([0, 0, sphereSize / -2 + o.webThickness - 1]);
// const webPost = cube([postSize, postSize, o.webThickness]).translate([
//   0,
//   0,
//   o.webThickness / -2 + o.webThickness,
// ]);
const webSphere = sphere({ d: sphereSize, $fn: sphereQuality }).translate([
  0,
  0,
  sphereSize / -2 + o.webThickness,
]);
const postOffset = { x: postSize / 2, y: postSize / 2 };
const sphereOffset = { x: o.caseSpacing, y: o.caseSpacing };
const thumbSphereOffset = { x: -o.caseSpacing, y: -o.caseSpacing };

const getWebPost = (
  pos: "TL" | "TR" | "BL" | "BR",
  shape: Shape3,
  offset: { x: number; y: number } = postOffset
) => {
  const [y, x] = pos.split("");

  return shape.translate([
    x === "L" ? p.mountWidth / -2 + offset.x : p.mountWidth / 2 - offset.x,
    y === "T" ? p.mountHeight / 2 - offset.y : p.mountHeight / -2 + offset.y,
    0,
  ]);
};

type Posts = { tr: Shape3; tl: Shape3; br: Shape3; bl: Shape3 };

const getPosts = (
  shape: Shape3,
  offset: { x: number; y: number } = postOffset
): Posts => {
  return {
    tr: getWebPost("TR", shape, offset),
    tl: getWebPost("TL", shape, offset),
    br: getWebPost("BR", shape, offset),
    bl: getWebPost("BL", shape, offset),
  };
};

const posts = {
  post: getPosts(webSphere),
  rim: getPosts(webRim, sphereOffset),
  thumb: getPosts(thumbSphere, thumbSphereOffset),
};

// Main key connectors
// util to partition array in to incremental segments
// used to build triangle hulls
const partition = <T extends any>(
  arr: Array<T>,
  size: number,
  offset: number
): Array<Array<T>> => {
  const partitionCount = arr.length - size + offset;
  const partitions: Array<Array<T>> = [];

  for (let i = 0; i < partitionCount; i++) {
    const start = i * offset;
    partitions.push(arr.slice(start, start + size));
  }

  return partitions;
};

const triangleHulls = (...args: Shape3[]) => {
  const validArgs = args.filter((value) => value !== null);
  const triGroups = partition<Shape3>(validArgs, 3, 1);
  const shapes: Shape3[] = [];
  triGroups.forEach(([first, ...rest]) => {
    shapes.push(first.hull(...rest)); // hull here
  });
  const [first, ...rest] = shapes;
  return first.union(...rest);
};

const keyConnectors = () => {
  const connectors: Shape3[] = [];

  // rows
  for (let col = -1; col < o.columns; col++) {
    for (let row = 0; row < o.rows; row++) {
      connectors.push(
        triangleHulls(
          keyPlace(col + 1, row, posts.post.tl),
          keyPlace(col, row, posts.post.tr),
          keyPlace(col + 1, row, posts.post.bl),
          keyPlace(col, row, posts.post.br)
        )
      );
    }
  }

  // columns
  for (let col = 0; col < o.columns; col++) {
    for (let row = -1; row < o.rows; row++) {
      connectors.push(
        triangleHulls(
          keyPlace(col, row, posts.post.bl),
          keyPlace(col, row, posts.post.br),
          keyPlace(col, row + 1, posts.post.tl),
          keyPlace(col, row + 1, posts.post.tr)
        )
      );
    }
  }

  // corners
  for (let col = -1; col < o.columns; col++) {
    for (let row = -1; row < o.rows; row++) {
      connectors.push(
        triangleHulls(
          keyPlace(col, row, posts.post.br),
          keyPlace(col, row + 1, posts.post.tr),
          keyPlace(col + 1, row, posts.post.bl),
          keyPlace(col + 1, row + 1, posts.post.tl)
        )
      );
    }
  }
  const [first, ...rest] = connectors;
  return first.union(...rest);
};

const thumbConnectors = () => {
  const connectors = [];
  // between thumb keys
  connectors.push(
    triangleHulls(
      thumbMPlace(posts.post.tr),
      thumbMPlace(posts.post.br),
      thumbRPlace(posts.post.tl),
      thumbRPlace(posts.post.bl)
    )
  );
  connectors.push(
    triangleHulls(
      thumbLPlace(posts.post.tr),
      thumbLPlace(posts.post.br),
      thumbMPlace(posts.post.tl),
      thumbMPlace(posts.post.bl)
    )
  );

  // direct to main body
  // middle thumb to col 0
  connectors.push(
    triangleHulls(
      keyPlace(-1, o.rows, posts.post.tr),
      keyPlace(-1, o.rows - 1, posts.rim.br),
      thumbLPlace(posts.thumb.tr)
    )
  );
  connectors.push(
    triangleHulls(
      keyPlace(-1, o.rows, posts.post.tr),
      // keyPlace(-1, o.rows - 1, posts.rim.br),
      thumbLPlace(posts.thumb.tr),
      thumbMPlace(posts.post.tl)
    )
  );
  connectors.push(
    triangleHulls(
      thumbMPlace(posts.post.tl),
      keyPlace(-1, o.rows, posts.post.tr),
      thumbMPlace(posts.post.tr),
      keyPlace(0, o.rows, posts.post.tl),
      keyPlace(0, o.rows, posts.post.tr)
    )
  );

  // right thumb
  connectors.push(
    triangleHulls(
      thumbRPlace(posts.post.tl),
      thumbMPlace(posts.post.tr),
      keyPlace(1, o.rows, posts.post.tl),
      keyPlace(0, o.rows, posts.post.tr)
    )
  );
  connectors.push(
    triangleHulls(
      thumbRPlace(posts.post.tl),
      thumbRPlace(posts.post.tr),
      keyPlace(1, o.rows, posts.post.tl),
      keyPlace(1, o.rows, posts.post.tr)
    )
  );

  connectors.push(
    triangleHulls(
      thumbRPlace(posts.thumb.br),
      thumbRPlace(posts.post.tr),
      keyPlace(3, o.rows, posts.rim.tl),
      keyPlace(3, o.rows, posts.post.tl)
    )
  );
  connectors.push(
    triangleHulls(
      thumbRPlace(posts.post.tr),
      keyPlace(3, o.rows, posts.post.tl),
      keyPlace(1, o.rows, posts.post.tr),
      keyPlace(2, o.rows, posts.post.tr),
      keyPlace(2, o.rows, posts.post.tl)
    )
  );

  const [first, ...rest] = connectors;
  return first.union(...rest);
};

const thumbRim = () => {
  const connectors = [];
  // between thumb keys
  connectors.push(
    triangleHulls(
      thumbMPlace(posts.post.tl),
      thumbLPlace(posts.post.tr),
      thumbLPlace(posts.thumb.tr)
    )
  );

  connectors.push(
    triangleHulls(
      thumbLPlace(posts.post.tl),
      thumbLPlace(posts.post.tr),
      thumbLPlace(posts.thumb.tl),
      thumbLPlace(posts.thumb.tr)
    )
  );

  connectors.push(
    triangleHulls(
      thumbLPlace(posts.post.tl),
      thumbLPlace(posts.post.bl),
      thumbLPlace(posts.thumb.tl),
      thumbLPlace(posts.thumb.bl)
    )
  );

  connectors.push(
    triangleHulls(
      thumbLPlace(posts.post.br),
      thumbLPlace(posts.post.bl),
      thumbLPlace(posts.thumb.br),
      thumbLPlace(posts.thumb.bl)
    )
  );

  connectors.push(
    triangleHulls(
      thumbLPlace(posts.post.br),
      thumbMPlace(posts.post.bl),
      thumbLPlace(posts.thumb.br)
    )
  );

  connectors.push(
    triangleHulls(
      thumbMPlace(posts.post.bl),
      thumbLPlace(posts.thumb.br),
      thumbMPlace(posts.post.br),
      thumbMPlace(posts.thumb.br)
    )
  );

  connectors.push(
    triangleHulls(
      thumbMPlace(posts.post.br),
      thumbRPlace(posts.post.bl),
      thumbMPlace(posts.thumb.br)
    )
  );

  connectors.push(
    triangleHulls(
      thumbRPlace(posts.post.bl),
      thumbMPlace(posts.thumb.br),
      thumbRPlace(posts.post.br),
      thumbRPlace(posts.thumb.br)
    )
  );

  connectors.push(
    triangleHulls(
      thumbRPlace(posts.post.tr),
      thumbRPlace(posts.post.br),
      thumbRPlace(posts.thumb.br)
    )
  );

  const [first, ...rest] = connectors;
  return first.union(...rest);
};

const thumbWalls = () => {
  const walls = [];
  walls.push(
    buildWall(thumbLPlace(posts.thumb.tr), thumbLPlace(posts.thumb.tl))
  );
  walls.push(
    buildWall(thumbLPlace(posts.thumb.tl), thumbLPlace(posts.thumb.bl))
  );
  walls.push(
    buildWall(thumbLPlace(posts.thumb.bl), thumbLPlace(posts.thumb.br))
  );
  walls.push(
    buildWall(thumbLPlace(posts.thumb.br), thumbMPlace(posts.thumb.br))
  );
  walls.push(
    buildWall(thumbMPlace(posts.thumb.br), thumbRPlace(posts.thumb.br))
  );
  walls.push(
    buildWall(thumbRPlace(posts.thumb.br), keyPlace(3, o.rows, posts.rim.tl))
  );

  const [first, ...rest] = walls;
  return first.union(...rest);
};

// Rims & Walls
const leftRim = () => {
  const rimHulls = [];
  for (let row = -1; row < o.rows; row++) {
    rimHulls.push(
      triangleHulls(
        keyPlace(-1, row, posts.rim.br),
        row < o.rows - 1 ? keyPlace(-1, row + 1, posts.rim.tr) : null,
        keyPlace(-1, row, posts.post.br),
        keyPlace(-1, row + 1, posts.post.tr)
      )
    );
    if (row >= 0) {
      rimHulls.push(
        triangleHulls(
          keyPlace(-1, row, posts.post.tr),
          keyPlace(-1, row, posts.rim.tr),
          keyPlace(-1, row, posts.post.br),
          keyPlace(-1, row, posts.rim.br)
        )
      );
    }
  }

  const [first, ...rest] = rimHulls;
  return first.union(...rest);
};

const leftWall = () => {
  const walls = [];
  for (let row = -1; row < o.rows; row++) {
    if (row < o.rows - 1) {
      walls.push(
        buildWall(
          keyPlace(-1, row, posts.rim.br),
          keyPlace(-1, row + 1, posts.rim.tr)
        )
      );
    }
    if (row >= 0) {
      walls.push(
        buildWall(
          keyPlace(-1, row, posts.rim.tr),
          keyPlace(-1, row, posts.rim.br)
        )
      );
    }
  }

  // thumb to left wall extra wall panel
  walls.push(
    buildWall(
      thumbLPlace(posts.thumb.tr),
      keyPlace(-1, o.rows - 1, posts.rim.br)
    )
  );

  const [first, ...rest] = walls;
  return first.union(...rest);
};

const topRim = () => {
  const rimHulls = [];

  let pOffset = 0;
  let pDiff = 0;
  for (let col = -1; col < o.columns; col++) {
    const offset = getColumnOffsets(col + 1)[2];
    const diff = offset - pOffset;
    const sphX = sphereOffset.x;

    const xR = Math.abs(diff) !== 0 ? (diff < 0 ? -sphX : sphX) : sphX;
    const xL = Math.abs(diff) !== 0 ? (diff > 0 ? -sphX : sphX) : sphX;
    const pR = Math.abs(pDiff) !== 0 ? (pDiff < 0 ? -sphX : sphX) : sphX;
    const pL = Math.abs(pDiff) !== 0 ? (pDiff > 0 ? -sphX : sphX) : sphX;

    const offsetR = { ...sphereOffset, x: xR };
    const offsetL = { ...sphereOffset, x: xL };
    const pOffsetR = { ...sphereOffset, x: pR };

    rimHulls.push(
      triangleHulls(
        keyPlace(col, -1, getWebPost("BR", webRim, offsetL)),
        keyPlace(col, -1, posts.post.br),
        keyPlace(col + 1, -1, getWebPost("BL", webRim, offsetR)),
        keyPlace(col + 1, -1, posts.post.bl)
      )
    );
    if (col >= 0) {
      rimHulls.push(
        triangleHulls(
          keyPlace(col, -1, getWebPost("BL", webRim, pOffsetR)),
          keyPlace(col, -1, getWebPost("BR", webRim, offsetL)),
          keyPlace(col, -1, posts.post.bl),
          keyPlace(col, -1, posts.post.br)
        )
      );
    }
    pOffset = offset;
    pDiff = diff;
  }

  const [first, ...rest] = rimHulls;
  return first.union(...rest);
};

const topWall = () => {
  const walls = [];

  let pOffset = 0;
  let pDiff = 0;
  for (let col = -1; col < o.columns; col++) {
    const offset = getColumnOffsets(col + 1)[2];
    const diff = offset - pOffset;
    const sphX = sphereOffset.x;

    const xR = Math.abs(diff) !== 0 ? (diff < 0 ? -sphX : sphX) : sphX;
    const xL = Math.abs(diff) !== 0 ? (diff > 0 ? -sphX : sphX) : sphX;
    const pR = Math.abs(pDiff) !== 0 ? (pDiff < 0 ? -sphX : sphX) : sphX;
    const pL = Math.abs(pDiff) !== 0 ? (pDiff > 0 ? -sphX : sphX) : sphX;

    const offsetR = { ...sphereOffset, x: xR };
    const offsetL = { ...sphereOffset, x: xL };
    const pOffsetR = { ...sphereOffset, x: pR };

    walls.push(
      buildWall(
        keyPlace(col, -1, getWebPost("BR", webRim, offsetL)),
        keyPlace(col + 1, -1, getWebPost("BL", webRim, offsetR))
      )
    );
    if (col >= 0) {
      walls.push(
        buildWall(
          keyPlace(col, -1, getWebPost("BL", webRim, pOffsetR)),
          keyPlace(col, -1, getWebPost("BR", webRim, offsetL))
        )
      );
    }
    pOffset = offset;
    pDiff = diff;
  }

  const [first, ...rest] = walls;
  return first.union(...rest);
};

const rightRim = () => {
  const rimHulls = [];
  for (let row = -1; row < o.rows; row++) {
    rimHulls.push(
      triangleHulls(
        keyPlace(o.columns, row, posts.rim.bl),
        keyPlace(o.columns, row + 1, posts.rim.tl),
        keyPlace(o.columns, row, posts.post.bl),
        keyPlace(o.columns, row + 1, posts.post.tl)
      )
    );
    if (row >= 0) {
      rimHulls.push(
        triangleHulls(
          keyPlace(o.columns, row, posts.post.tl),
          keyPlace(o.columns, row, posts.rim.tl),
          keyPlace(o.columns, row, posts.post.bl),
          keyPlace(o.columns, row, posts.rim.bl)
        )
      );
    }
  }

  const [first, ...rest] = rimHulls;
  return first.union(...rest);
};

const rightWall = () => {
  const walls = [];
  for (let row = -1; row < o.rows; row++) {
    walls.push(
      buildWall(
        keyPlace(o.columns, row, posts.rim.bl),
        keyPlace(o.columns, row + 1, posts.rim.tl)
      )
    );
    if (row >= 0) {
      walls.push(
        buildWall(
          keyPlace(o.columns, row, posts.rim.bl),
          keyPlace(o.columns, row, posts.rim.tl)
        )
      );
    }
  }

  const [first, ...rest] = walls;
  return first.union(...rest);
};

const bottomRim = () => {
  const rimHulls = [];

  let pOffset = 0;
  let pDiff = 0;
  const sphX = sphereOffset.x;

  for (let col = o.columns - 1; col >= 3; col--) {
    const offset = getColumnOffsets(col)[2];
    const diff = offset - pOffset;

    const xR = Math.abs(diff) !== 0 ? (diff > 0 ? -sphX : sphX) : sphX;
    const xL = Math.abs(diff) !== 0 ? (diff < 0 ? -sphX : sphX) : sphX;
    const pR = Math.abs(pDiff) !== 0 ? (pDiff < 0 ? -sphX : sphX) : -sphX;
    const pL = Math.abs(pDiff) !== 0 ? (pDiff > 0 ? sphX : -sphX) : -sphX;

    const offsetR = { ...sphereOffset, x: xR };
    const offsetL = { ...sphereOffset, x: xL };
    const pOffsetR = { ...sphereOffset, x: pR };
    const pOffsetL = { ...sphereOffset, x: pL };

    rimHulls.push(
      triangleHulls(
        keyPlace(col, o.rows, getWebPost("TR", webRim, offsetR)),
        keyPlace(col, o.rows, posts.post.tr),
        keyPlace(col + 1, o.rows, getWebPost("TL", webRim, offsetL)),
        keyPlace(col + 1, o.rows, posts.post.tl)
      )
    );
    if (col >= 0) {
      rimHulls.push(
        triangleHulls(
          keyPlace(col, o.rows, getWebPost("TL", webRim, pOffsetL)),
          keyPlace(col, o.rows, getWebPost("TR", webRim, pOffsetR)),
          keyPlace(col, o.rows, posts.post.tl),
          keyPlace(col, o.rows, posts.post.tr)
        )
      );
    }
    pOffset = offset;
    pDiff = diff;
  }

  const [first, ...rest] = rimHulls;
  return first.union(...rest);
};

const bottomWall = () => {
  const walls = [];

  let pOffset = 0;
  let pDiff = 0;
  const sphX = sphereOffset.x;

  for (let col = o.columns - 1; col >= 3; col--) {
    const offset = getColumnOffsets(col)[2];
    const diff = offset - pOffset;

    const xR = Math.abs(diff) !== 0 ? (diff > 0 ? -sphX : sphX) : sphX;
    const xL = Math.abs(diff) !== 0 ? (diff < 0 ? -sphX : sphX) : sphX;
    const pR = Math.abs(pDiff) !== 0 ? (pDiff < 0 ? -sphX : sphX) : -sphX;
    const pL = Math.abs(pDiff) !== 0 ? (pDiff > 0 ? sphX : -sphX) : -sphX;

    const offsetR = { ...sphereOffset, x: xR };
    const offsetL = { ...sphereOffset, x: xL };
    const pOffsetR = { ...sphereOffset, x: pR };
    const pOffsetL = { ...sphereOffset, x: pL };

    walls.push(
      buildWall(
        keyPlace(col, o.rows, getWebPost("TR", webRim, offsetR)),
        keyPlace(col + 1, o.rows, getWebPost("TL", webRim, offsetL))
      )
    );
    if (col >= 0) {
      walls.push(
        buildWall(
          keyPlace(col, o.rows, getWebPost("TL", webRim, pOffsetL)),
          keyPlace(col, o.rows, getWebPost("TR", webRim, pOffsetR))
        )
      );
    }
    pOffset = offset;
    pDiff = diff;
  }

  const [first, ...rest] = walls;
  return first.union(...rest);
};

export const caseWalls = () => {
  return leftWall().union(topWall(), rightWall(), bottomWall(), thumbWalls());
};

export const caseRim = () => {
  return leftRim().union(topRim(), rightRim(), bottomRim(), thumbRim());
};

export const USBHolder = () => {
  const [x, y] = getKeyPosition(1, 0);
  return importModel(`../../models/${o.mcuHolder}.stl`)
    .rotate([0, 0, getColumnSplay(0)])
    .translate([x, y + 1.8, 0])
    .translate([
      -p.mountWidth / 2,
      p.mountHeight / 2 + o.caseSpacing + sphereSize + 0.5,
      0,
    ])
    .translate([o.mcuHolder === "rpi-pico" ? -1 : 0, 0, 0]);
};

export const USBHolderSpace = () => {
  return USBHolder()
    .projection()
    .linear_extrude({ height: 13.02, center: false })
    .translate([0, 0, -1]);
};

export const previewKeycaps = () =>
  placeKeys((row: number) => singleKeycap(row))
    .color("grey")
    .union(placeThumbs((row: number) => singleKeycap(row), true))
    .color("grey");

export const previewTrackpad = () =>
  thumbRPlace(cylinder({ d: 40, h: 2, $fn: 70 }).translate([0, 0, 6.5])).color(
    "#222222"
  );

export const trackpadInset = () => {
  return thumbRPlace(cylinder({ d: 40, h: 8, $fn: 50 }).translate([0, 0, 7]))
    .hull(
      thumbRPlace(posts.post.br).union(
        thumbRPlace(posts.post.bl),
        thumbRPlace(posts.post.tl),
        keyPlace(3, 3, posts.post.tl).translate([0, -2, 0]),
        keyPlace(2, 3, posts.post.tr).translate([0, -2, 0]),
        keyPlace(2, 3, posts.post.tl).translate([0, -2, 0])
      )
    )
    .union(
      thumbRPlace(
        cylinder({ d: 20, h: 80 }).translate([0, 6, 0]).rotate([12, 0, -6])
      )
    );
  // .translate([0, 0, 5]);
};

export const trackpadOuter = () =>
  thumbRPlace(cylinder({ d: 42, h: 4, $fn: 70 }).translate([0, 0, 3])).hull(
    thumbRPlace(posts.thumb.br).union(
      thumbRPlace(posts.thumb.bl),
      thumbRPlace(posts.thumb.tl),
      keyPlace(3, 3, posts.rim.tl),
      keyPlace(2, 3, posts.post.tr),
      keyPlace(2, 3, posts.post.tl)
    )
    // .translate([0, 0, -5])
  );

export const trackpad = () => {
  const hullForm = trackpadOuter().difference(trackpadInset());

  return thumbRPlace(
    importModel("../../models/cirque-40-flat.stl")
      .rotate([0, 0, 180])
      .translate([0, 0, 5])
  ).union(hullForm);
};

export const buildCase = (keyhole: Shape3, mirror: boolean = false) => {
  const models = [];
  if (o.trackpad) {
    models.push(trackpad());
  } else if (o.encoder) {
    models.push(
      thumbRPlace(importModel("../../models/ec11.stl")).translate([
        0, -0.8, -2.5,
      ])
    );
  }

  return placeKeys(keyhole)
    .union(
      keyConnectors(),
      caseWalls().difference(USBHolderSpace()),
      caseRim(),
      placeThumbs(keyhole),
      thumbConnectors()
    )
    .difference(...[o.trackpad && trackpadOuter()])
    .union(...models) // add models after cutting away
    .mirror([Number(mirror), 0, 0]);
};

export const outline = () => {
  return placeKeys(filledKeyhole()).union(
    keyConnectors(),
    caseWalls().difference(USBHolderSpace()),
    caseRim(),
    placeThumbs(filledKeyhole()),
    thumbConnectors()
  );
};

export const buildPlate = () => {
  const shape = outline().projection();
  return shape
    .difference(
      shape
        .offset({ delta: -4 })
        .difference(
          importShape("../../models/voronoi.dxf")
            .scale([0.25, 0.25, 1])
            .translate([-168, -85, 0])
        )
    )
    .linear_extrude({ height: o.plateThickness, center: false });
};

export const main = buildCase(singleKeyhole())
  .union
  // USBHolder().debug()
  // previewKeycaps(),
  // previewTrackpad()
  ();
