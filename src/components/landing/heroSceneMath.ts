// Shared geometry and timing for the pinned hero + sharing scene.
// Positions are measured from the stage's bottom-centre: x right, y down
// (so "up" is negative), matching elements placed with `bottom-0 left-1/2`.

export const NAV_HEIGHT = 68;
export const MOBILE_MAX = 768;

/** Share of the scroll track used by the hero before the sharing scene starts. */
export const HERO_END = 0.1273;
/** Share of the scroll track at which the sharing scene ends and the sync scene starts. */
export const SHARE_END = 0.3091;
/** Share of the scroll track at which the sync scene ends and the security text takes over. */
export const SYNC_END = 0.6636;
/** Share of the scroll track at which the security scene ends and the exit begins. */
export const SECURE_END = 0.9364;

// The sync scene pauses on its connected state (devices in a row, beams lit)
// for a stretch of scrolling before carrying on. SYNC_HOLD_AT is the point in
// the scene's own timeline where it pauses; the other two are the shares of
// the sync scroll spent before the pause and during it.
const SYNC_HOLD_AT = 0.69;
const SYNC_HOLD_START = 0.513;
const SYNC_HOLD_LENGTH = 0.256;

/** Maps raw sync scroll progress (0 to 1) to the scene timeline, with the pause built in. */
export function syncTimeline(raw: number) {
  const holdEnd = SYNC_HOLD_START + SYNC_HOLD_LENGTH;
  if (raw <= SYNC_HOLD_START) return (raw / SYNC_HOLD_START) * SYNC_HOLD_AT;
  if (raw <= holdEnd) return SYNC_HOLD_AT;
  return SYNC_HOLD_AT + ((raw - holdEnd) / (1 - holdEnd)) * (1 - SYNC_HOLD_AT);
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const seg = (p: number, from: number, to: number) => clamp01((p - from) / (to - from));
export const ease = (t: number) => t * t * (3 - 2 * t);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const isMobile = (width: number) => width < MOBILE_MAX;

/** Folder size multiplier: small while peeking at rest, larger once it is centre stage. */
export const folderRestScale = (width: number) => (isMobile(width) ? 1.1 : 1.5);
export const folderScale = (width: number) => (isMobile(width) ? 1.45 : 2.1);
/** Folder offset from the stage's bottom edge: half hidden at rest, centred when full. */
export const folderRestY = (scale: number) => 65 * scale - NAV_HEIGHT;
export const folderFullY = (height: number, scale: number) => -(height / 2 - 65 * scale) + 50;

// Folder and card sizes in folder units (multiply by the folder scale for px).
export const FOLDER_HEIGHT = 130;
export const CARD_WIDTH = 128;
export const CARD_HEIGHT = 100;
/** How far a stored card's bottom edge sits above the folder's bottom edge. */
export const CARD_REST = 44;
/** Stored cards are drawn slightly smaller than the folder scale. */
export const CARD_FIT = 0.98;
/** How far a card rises out of the folder before it is dragged away. */
export const CARD_LIFT = 30;

export interface Grab {
  /** Person shown on the cursor pill. */
  name: string;
  initials: string;
  avatarColor: string;
  /** File card (by name) this person takes out of the folder. */
  file: string;
  /** Which side of the arrow the pill hangs on. */
  pill: "left" | "right";
  /** Sharing-progress windows. */
  enter: [number, number];
  lift: [number, number];
  drag: [number, number];
  /** Off-screen start, as fractions of the stage from its top-left. */
  from: [number, number];
  /** Waiting spot near the folder, as fractions of the stage from its top-left. */
  hover: [number, number];
  hoverMobile: [number, number];
  /** Where on the card the cursor holds it, as fractions of the card from its centre. */
  hold: [number, number];
  /** Exit direction: x in half-stage widths, y in stage heights. */
  exit: [number, number];
  tilt: number;
}

// In the order they take a card. The cards are the top three of the stack.
export const GRABS: Grab[] = [
  {
    name: "Jhone",
    initials: "J",
    avatarColor: "#0f172a",
    file: "site.html",
    pill: "right",
    enter: [0, 0.1],
    lift: [0.12, 0.25],
    drag: [0.25, 0.46],
    from: [1.05, 0.12],
    hover: [0.69, 0.35],
    hoverMobile: [0.62, 0.345],
    hold: [0.32, -0.28],
    exit: [1, -0.4],
    tilt: 6,
  },
  {
    name: "Anabella",
    initials: "A",
    avatarColor: "#be185d",
    file: "data.csv",
    pill: "left",
    enter: [0.02, 0.12],
    lift: [0.28, 0.41],
    drag: [0.41, 0.63],
    from: [-0.05, 0.36],
    hover: [0.3, 0.37],
    hoverMobile: [0.33, 0.35],
    hold: [-0.36, -0.26],
    exit: [-1, -0.04],
    tilt: -7,
  },
  {
    name: "Alex",
    initials: "A",
    avatarColor: "#15803d",
    file: "logo.fig",
    pill: "right",
    enter: [0.04, 0.14],
    lift: [0.47, 0.6],
    drag: [0.6, 0.85],
    from: [1.05, 0.84],
    hover: [0.74, 0.55],
    hoverMobile: [0.68, 0.56],
    hold: [0.26, 0.12],
    exit: [1, 0.3],
    tilt: 5,
  },
];

/** How far a grabbed card has been lifted and dragged at sharing progress `q`. */
export function grabMotion(q: number, grab: Grab, width: number, height: number) {
  const scale = folderScale(width);
  const dragged = ease(seg(q, grab.drag[0], grab.drag[1]));
  return {
    lift: CARD_LIFT * scale * ease(seg(q, grab.lift[0], grab.lift[1])),
    dx: grab.exit[0] * (width / 2 + 340) * dragged,
    dy: grab.exit[1] * height * dragged,
    dragged,
    held: q >= grab.lift[1],
  };
}

/** Cursor tip position (from the stage's top-left) at sharing progress `q`. */
export function cursorPosition(q: number, grab: Grab, width: number, height: number) {
  const scale = folderScale(width);
  const hover = isMobile(width) ? grab.hoverMobile : grab.hover;
  const entered = ease(seg(q, grab.enter[0], grab.enter[1]));
  const approached = ease(seg(q, grab.lift[0], grab.lift[1]));
  const { dx, dy } = grabMotion(q, grab, width, height);

  const cardCentreX = width / 2;
  const cardCentreY =
    height + folderFullY(height, scale) - (CARD_REST + CARD_LIFT + (CARD_HEIGHT * CARD_FIT) / 2) * scale;
  const holdX = cardCentreX + grab.hold[0] * CARD_WIDTH * CARD_FIT * scale;
  const holdY = cardCentreY + grab.hold[1] * CARD_HEIGHT * CARD_FIT * scale;

  const waitX = lerp(grab.from[0] * width, hover[0] * width, entered);
  const waitY = lerp(grab.from[1] * height, hover[1] * height, entered);

  return {
    x: lerp(waitX, holdX, approached) + dx,
    y: lerp(waitY, holdY, approached) + dy,
  };
}

// ---------------------------------------------------------------------------
// Sync scene: the folder docks under the heading, three devices line up below
// it and beams connect them. `s` is the sync progress (0 to 1) throughout.
// ---------------------------------------------------------------------------

/** Top of the feature heading / description, measured from the top of the stage. */
export const headingTop = (width: number, height: number) => {
  const scale = folderScale(width);
  return (
    height + folderFullY(height, scale) - (FOLDER_HEIGHT + CARD_LIFT) * scale - (isMobile(width) ? 84 : 104)
  );
};
export const descriptionTop = (width: number, height: number) =>
  height + folderFullY(height, folderScale(width)) + (isMobile(width) ? 28 : 44);

/** Folder size while docked, relative to its full size. */
export const DOCK_SCALE = 0.55;

/** 0 = folder at full size in the centre, 1 = docked small under the heading. */
export const dockAmount = (s: number) => ease(seg(s, 0.2, 0.55)) * (1 - ease(seg(s, 0.8, 1)));

/** The docked folder: its scale, and its bottom edge measured from the top of the stage. */
export function dockedFolder(width: number, height: number) {
  const scale = folderScale(width) * DOCK_SCALE;
  const bottom =
    headingTop(width, height) + (isMobile(width) ? 52 : 66) + (CARD_REST + CARD_HEIGHT * CARD_FIT) * scale;
  return { scale, bottom };
}

/** Where the full-size folder is headed at sync progress `s` (bottom-centre coordinates). */
export function folderTarget(width: number, height: number, s: number, c = 0, _exit = 0) {
  const full = folderScale(width);
  const dock = dockedFolder(width, height);
  const d = dockAmount(s);
  let y = lerp(folderFullY(height, full), dock.bottom - height, d);
  let scale = lerp(full, dock.scale, d);
  // Security scene (`c`): the folder shrinks into the centre of the circle.
  const shrink = secureShrink(c);
  if (shrink > 0) {
    const shielded = shieldedFolder(width, height);
    y = lerp(y, shielded.bottom - height, shrink);
    scale = lerp(scale, shielded.scale, shrink);
  }
  // The exit phase does not move the folder: it stays where it is while the security text
  // fades out and the next section rises beneath it (see the track's negative bottom margin).
  return { y, scale };
}

/** How far the security text has faded up and out during the exit (0 to 1). */
export const exitText = (e: number) => ease(seg(e, 0, 0.3));

// ---------------------------------------------------------------------------
// Security scene: the folder shrinks inside a blue circle while a ring draws
// around it, then a shield covers it; after a pause everything unwinds.
// `c` is the security progress (0 to 1). The text swap takes the first 15%.
// ---------------------------------------------------------------------------

const SECURE_TURN = 0.65; // before this the scene builds up, after it unwinds

/** 0 = folder at full size, 1 = folder at its smallest inside the shield. */
export const secureShrink = (c: number) =>
  c < SECURE_TURN
    ? 0.63 * ease(seg(c, 0.15, 0.3)) + 0.37 * ease(seg(c, 0.3, 0.5))
    : 1 - (0.37 * ease(seg(c, 0.72, 0.82)) + 0.63 * ease(seg(c, 0.82, 0.96)));

/** Opacity of the blue circle. */
export const secureCircle = (c: number) =>
  c < SECURE_TURN ? ease(seg(c, 0.15, 0.36)) : 1 - ease(seg(c, 0.8, 0.97));

/** The ring is the arc from `start` to `end` (shares of a full turn, clockwise from the top). */
export const secureRing = (c: number) => ({
  start: ease(seg(c, 0.68, 0.95)),
  end: ease(seg(c, 0.17, 0.56)),
});

/** Opacity of the faint glass shield, and of the solid shield that covers the folder. */
export const secureShieldOutline = (c: number) =>
  c < SECURE_TURN ? ease(seg(c, 0.38, 0.5)) : 1 - ease(seg(c, 0.76, 0.84));
export const secureShieldFill = (c: number) =>
  ease(seg(c, 0.5, 0.58)) * (1 - ease(seg(c, 0.68, 0.76)));

/** How far the heading and description are nudged up (px) to make room for the circle. */
export const SECURE_TEXT_LIFT = 22;
export const secureLift = (c: number) =>
  c < SECURE_TURN ? ease(seg(c, 0.15, 0.3)) : 1 - ease(seg(c, 0.84, 0.97));

/** Centre and radius of the circle, fitted between the (lifted) heading and description. */
export function secureCircleGeometry(width: number, height: number) {
  const top = headingTop(width, height) + (isMobile(width) ? 46 : 54);
  const bottom = descriptionTop(width, height) - 48;
  const r = Math.max(0, Math.min((bottom - top) / 2, width * 0.42));
  return { cx: width / 2, cy: (top + bottom) / 2, r };
}

/** The folder at its smallest: its scale, and its bottom edge measured from the top of the stage. */
export function shieldedFolder(width: number, height: number) {
  const { cy, r } = secureCircleGeometry(width, height);
  const scale = (0.6 * r) / 180;
  return { scale, bottom: cy + ((CARD_REST + CARD_HEIGHT * CARD_FIT) / 2) * scale };
}

export interface SyncDevice {
  id: "laptop" | "tablet" | "phone";
  /** Size in px at desktop scale. */
  size: [number, number];
  /** Horizontal offset of its row slot from the stage centre, in px at desktop scale. */
  slot: number;
  /** Off-screen start and loose "orbit" spot, as fractions of the stage from its top-left. */
  from: [number, number];
  orbit: [number, number];
  orbitMobile: [number, number];
  /** Which way its beam leaves the folder. */
  beam: "left" | "down" | "right";
  /**
   * Optional smooth curve it follows into its row slot (and back out), as a cubic Bezier:
   * `start` is the first point (fractions of the stage from its top-left), `lead` is the first
   * control point as an offset from `start`, and `arrive` is the second control point as an
   * offset from the row slot (both in fractions of the stage width and height).
   */
  curve?: { start: [number, number]; lead: [number, number]; arrive: [number, number] };
}

export const SYNC_DEVICES: SyncDevice[] = [
  {
    id: "laptop",
    size: [200, 110],
    slot: -212,
    from: [-0.14, 0.14],
    orbit: [0.2, 0.34],
    orbitMobile: [0.2, 0.41],
    beam: "left",
    // Fitted to the path drawn on the storyboard: it comes in from the upper left, bends down
    // in one smooth arc and arrives heading straight down into its slot.
    curve: { start: [-0.148, 0.238], lead: [0.443, 0.075], arrive: [-0.075, -0.082] },
  },
  {
    id: "tablet",
    size: [180, 124],
    slot: 22,
    from: [-0.14, 0.74],
    orbit: [0.34, 0.66],
    orbitMobile: [0.24, 0.63],
    beam: "down",
    // One smooth glide from the lower left into its slot. (Moving through a separate stop at
    // the orbit spot made it stall there before moving on.)
    curve: { start: [-0.14, 0.755], lead: [0.36, -0.03], arrive: [-0.3, 0] },
  },
  {
    id: "phone",
    size: [96, 170],
    slot: 216,
    from: [1.14, 0.5],
    orbit: [0.8, 0.58],
    orbitMobile: [0.84, 0.58],
    beam: "right",
    // Same single glide, from the right.
    curve: { start: [1.14, 0.52], lead: [-0.36, 0.02], arrive: [0.28, -0.02] },
  },
];

/** Device size multiplier for the current stage width. */
export const deviceUnit = (width: number) => (isMobile(width) ? 0.52 : 1);

/** Place of a device in the row under the docked folder (centre and top edge, from the top-left). */
export function deviceRow(device: SyncDevice, width: number, height: number) {
  const unit = deviceUnit(width);
  const bottom = descriptionTop(width, height) - (isMobile(width) ? 18 : 24);
  return {
    x: width / 2 + device.slot * (isMobile(width) ? 0.55 : 1),
    y: bottom - (device.size[1] * unit) / 2,
    top: bottom - device.size[1] * unit,
  };
}

/** Device centre at sync progress `s`: off screen, orbit, row, orbit, off screen. */
export function devicePosition(s: number, device: SyncDevice, width: number, height: number) {
  const orbit = isMobile(width) ? device.orbitMobile : device.orbit;
  const row = deviceRow(device, width, height);
  if (device.curve) {
    const { start, lead, arrive } = device.curve;
    // One smooth glide along the curve: in over the first half of the scene, back out at the end.
    const t = s < 0.7 ? ease(seg(s, 0.2, 0.55)) : 1 - ease(seg(s, 0.8, 1));
    const p0 = { x: start[0] * width, y: start[1] * height };
    const p1 = { x: p0.x + lead[0] * width, y: p0.y + lead[1] * height };
    const p2 = { x: row.x + arrive[0] * width, y: row.y + arrive[1] * height };
    const u = 1 - t;
    const b = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
    return {
      x: b[0] * p0.x + b[1] * p1.x + b[2] * p2.x + b[3] * row.x,
      y: b[0] * p0.y + b[1] * p1.y + b[2] * p2.y + b[3] * row.y,
    };
  }
  const off = { x: device.from[0] * width, y: device.from[1] * height };
  const mid = { x: orbit[0] * width, y: orbit[1] * height };
  const mix = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
  });
  if (s < 0.7) {
    return mix(mix(off, mid, ease(seg(s, 0.2, 0.4))), row, ease(seg(s, 0.4, 0.55)));
  }
  return mix(mix(row, mid, ease(seg(s, 0.8, 0.88))), off, ease(seg(s, 0.88, 1)));
}

/** How much of each beam is drawn (0 to 1): draws once the row is formed, retracts before it breaks up. */
export const beamAmount = (s: number) => ease(seg(s, 0.56, 0.68)) * (1 - ease(seg(s, 0.7, 0.79)));

/** SVG path of the beam for a device, from the docked folder to the top of the device. */
export function beamPath(device: SyncDevice, width: number, height: number) {
  const dock = dockedFolder(width, height);
  const row = deviceRow(device, width, height);
  const centre = width / 2;
  const end = row.top - 6;
  if (device.beam === "down") {
    return `M ${centre} ${dock.bottom + 8} V ${end}`;
  }
  const side = device.beam === "left" ? -1 : 1;
  const startX = centre + side * (90 * dock.scale + 6);
  const y = dock.bottom - 62 * dock.scale;
  const radius = Math.max(0, Math.min(isMobile(width) ? 10 : 18, Math.abs(row.x - startX)));
  return `M ${startX} ${y} H ${row.x - side * radius} Q ${row.x} ${y} ${row.x} ${y + radius} V ${end}`;
}
