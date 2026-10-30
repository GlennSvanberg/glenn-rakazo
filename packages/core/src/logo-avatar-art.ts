/** Rounded geometric body with a broad dome. No raster image is embedded. */
export const LOGO_BODY_PATH = "M12 40C12 2 88 2 88 40L88 108H12Z";
export const LOGO_LEFT_HAND_PATH =
  "M26 58H44Q52 58 52 66V68Q52 76 44 76H26Q18 76 18 68V66Q18 58 26 58Z";
export const LOGO_RIGHT_HAND_PATH =
  "M56 76H74Q82 76 82 84V86Q82 94 74 94H56Q48 94 48 86V84Q48 76 56 76Z";

/** Shared vector paint palette for web SVG and react-native-svg. */
export function logoAvatarPaint(hex: string, originalOrange = false) {
  const full = hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join("")}` : hex;
  const raw = full;
  void originalOrange;
  const rgb = [1, 3, 5].map((i) => Number.parseInt(raw.slice(i, i + 2), 16));
  const shade = (factor: number) =>
    `#${rgb
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(v * factor)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")}`;
  return {
    base: shade(1),
    light: shade(1.12),
    mid: shade(1),
    shadow: shade(0.8),
    edge: shade(0.96),
    deep: shade(0.55),
    flank: shade(0.58),
    contact: shade(0.42),
    rim: `#${rgb
      .map((v) =>
        Math.round(v + (255 - v) * 0.9)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")}`,
  };
}

/** Shared, directional surface lighting for web and native SVG bodies. */
export const LOGO_AVATAR_LIGHTING = {
  body: { cx: "57%", cy: "30%", r: "76%" },
  flank: {
    gradientUnits: "userSpaceOnUse",
    cx: 0,
    cy: 0,
    r: 1,
    gradientTransform: "matrix(45 0 0 44 0 32)",
  },
  crown: {
    gradientUnits: "userSpaceOnUse",
    cx: 0,
    cy: 0,
    r: 1,
    gradientTransform: "matrix(34 0 0 33 57 23.5)",
    peak: 0.28,
    shoulder: 0.12,
  },
  leftHand: { cx: "60%", cy: "35%", r: "76%" },
  rightHand: { cx: "40%", cy: "35%", r: "76%" },
  leftContact: {
    gradientUnits: "userSpaceOnUse",
    cx: 0,
    cy: 0,
    r: 1,
    gradientTransform: "matrix(7.5 0 0 17 24.5 91)",
  },
  rightContact: {
    gradientUnits: "userSpaceOnUse",
    cx: 0,
    cy: 0,
    r: 1,
    gradientTransform: "matrix(7.5 0 0 17 75.5 91)",
  },
  rimUpper: {
    gradientUnits: "userSpaceOnUse",
    cx: 0,
    cy: 0,
    r: 1.1,
    gradientTransform: "matrix(35.3494 0 0 45.3948 50.0193 49.4219)",
  },
  rimLeftTrim: {
    gradientUnits: "userSpaceOnUse",
    cx: 0,
    cy: 0,
    r: 1,
    gradientTransform: "matrix(8.4 0 0 10.5 36 19)",
  },
  rimLeft: {
    gradientUnits: "userSpaceOnUse",
    cx: 0,
    cy: 0,
    r: 1.1,
    gradientTransform: "matrix(66.2501 0 0 63.0879 -50 30.676)",
  },
  rimRight: {
    gradientUnits: "userSpaceOnUse",
    cx: 0,
    cy: 0,
    r: 1.1,
    gradientTransform: "matrix(66.2472 0 0 63.3467 150 30.5562)",
  },
  handLight: { leftPeak: 0.15, rightPeak: 0.24, radius: "62%" },
} as const;
