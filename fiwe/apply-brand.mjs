#!/usr/bin/env node
/**
 * Re-apply the Fiwe brand onto a Rakazo tree. Idempotent: run it again after
 * merging upstream. See fiwe/README.md.
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const fiweDir = dirname(fileURLToPath(import.meta.url));
const root = join(fiweDir, "..");
const brand = JSON.parse(readFileSync(join(fiweDir, "brand.json"), "utf8"));
const productName = brand.productName;
const fontStack = `"${brand.fontFamily}", ${brand.fontFallback}`;
const appliedPath = join(fiweDir, ".applied-product-name");
const previousName = existsSync(appliedPath) ? readFileSync(appliedPath, "utf8").trim() : "";

const midnight = "#00002C";
const vanilla = "#FFFEE8";
const purple = "#9A4DFF";
const pink = "#E788CE";
const teal = "#1FFFF8";
const mint = "#47FF9A";
const yellow = "#F3F316";
const orange = "#F36F16";

/** Dark-mode link purple: a vanilla tint of the brand purple so it clears AA on lifted cards. */
const purpleOnMidnight = "#A45FFD";
/** Light-mode link purple: a midnight shade of the brand purple. */
const purpleOnVanilla = "#6B2BD4";
const mintOnVanilla = "#0B7A45";
const orangeOnVanilla = "#A3470C";
const pinkOnVanilla = "#9A2068";
const pinkFill = "#8E2F6A";

const darkTokens = {
  background: midnight,
  dialog: "#16164A",
  foreground: vanilla,
  card: "#14143E",
  cardForeground: vanilla,
  popover: "#16164A",
  popoverForeground: vanilla,
  glassFill: "#1C1C4E",
  glassStroke: "#FFFEE826",
  primary: vanilla,
  primaryForeground: midnight,
  secondary: "#FFFEE814",
  secondaryForeground: vanilla,
  chatUser: "#2A2A5C",
  chatUserForeground: vanilla,
  muted: "#101038",
  mutedForeground: "#FFFEE8B8",
  faintForeground: "#FFFEE89E",
  accent: "#9A4DFF33",
  accentForeground: vanilla,
  destructive: pink,
  destructiveFill: pinkFill,
  destructiveForeground: vanilla,
  border: "#FFFEE81F",
  input: "#FFFEE838",
  ring: purpleOnMidnight,
  sidebar: "#00001A",
  sidebarForeground: vanilla,
  sidebarBorder: "#FFFEE81A",
  sidebarAccent: "#3A1C78",
  sidebarAccentForeground: vanilla,
  link: purpleOnMidnight,
  faviconPlate: "#FFFFFF",
  success: mint,
  warning: orange,
  statusWorking: purpleOnMidnight,
  unread: "#5A24C4",
  workingDot: mint,
  overlay: "rgba(0, 0, 44, 0.72)",
  scrollbar: "#FFFEE838",
  scrollbarHover: "#FFFEE880",
};

const lightTokens = {
  background: vanilla,
  dialog: "#FFFFFF",
  foreground: midnight,
  card: "#EDECDB",
  cardForeground: midnight,
  popover: "#FFFFFF",
  popoverForeground: midnight,
  glassFill: "#FFFFFF",
  glassStroke: "#00002C16",
  primary: midnight,
  primaryForeground: vanilla,
  secondary: "#00002C0F",
  secondaryForeground: midnight,
  chatUser: midnight,
  chatUserForeground: vanilla,
  muted: "#E6E4CE",
  mutedForeground: "#00002C9E",
  faintForeground: "#00002C8C",
  accent: "#9A4DFF1A",
  accentForeground: midnight,
  destructive: pinkOnVanilla,
  destructiveFill: pinkFill,
  destructiveForeground: vanilla,
  border: "#00002C1F",
  input: "#00002C3D",
  ring: purpleOnVanilla,
  sidebar: "#E0DEC8",
  sidebarForeground: midnight,
  sidebarBorder: "#00002C1F",
  sidebarAccent: "#FFFFFF",
  sidebarAccentForeground: midnight,
  link: purpleOnVanilla,
  faviconPlate: "#FFFFFF",
  success: mintOnVanilla,
  warning: orangeOnVanilla,
  statusWorking: purpleOnVanilla,
  unread: "#5A24C4",
  workingDot: mint,
  overlay: "rgba(0, 0, 44, 0.45)",
  scrollbar: "#00002C3D",
  scrollbarHover: "#00002C85",
};

const webDarkOverrides = {
  background: darkTokens.background,
  dialog: darkTokens.dialog,
  foreground: darkTokens.foreground,
  card: darkTokens.card,
  cardForeground: darkTokens.cardForeground,
  popover: darkTokens.popover,
  popoverForeground: darkTokens.popoverForeground,
  primary: darkTokens.primary,
  primaryHover: "#E6E5CF",
  primaryDisabled: "#FFFEE833",
  primaryForeground: darkTokens.primaryForeground,
  secondary: darkTokens.secondary,
  secondaryForeground: darkTokens.secondaryForeground,
  chatUser: darkTokens.chatUser,
  chatUserForeground: darkTokens.chatUserForeground,
  muted: darkTokens.muted,
  mutedForeground: "#FFFEE8DB",
  faintForeground: darkTokens.faintForeground,
  accent: darkTokens.accent,
  accentForeground: darkTokens.accentForeground,
  destructive: darkTokens.destructive,
  destructiveFill: darkTokens.destructiveFill,
  border: darkTokens.border,
  input: darkTokens.input,
  ring: darkTokens.ring,
  sidebar: darkTokens.sidebar,
  sidebarForeground: darkTokens.sidebarForeground,
  sidebarBorder: darkTokens.sidebarBorder,
  sidebarAccent: darkTokens.sidebarAccent,
  sidebarAccentForeground: darkTokens.sidebarAccentForeground,
  link: darkTokens.link,
  success: darkTokens.success,
  warning: darkTokens.warning,
  statusWorking: darkTokens.statusWorking,
  unread: darkTokens.unread,
  workingDot: darkTokens.workingDot,
  overlay: "#00002CB8",
  scrollbar: darkTokens.scrollbar,
  scrollbarHover: darkTokens.scrollbarHover,
};

const webLightOverrides = {
  background: lightTokens.background,
  foreground: lightTokens.foreground,
  card: lightTokens.card,
  cardForeground: lightTokens.cardForeground,
  popoverForeground: lightTokens.popoverForeground,
  primary: lightTokens.primary,
  primaryHover: "#24244A",
  primaryDisabled: "#00002C26",
  primaryForeground: lightTokens.primaryForeground,
  secondary: lightTokens.secondary,
  secondaryForeground: lightTokens.secondaryForeground,
  chatUser: lightTokens.chatUser,
  muted: lightTokens.muted,
  mutedForeground: "#00002CC7",
  faintForeground: lightTokens.faintForeground,
  accent: lightTokens.accent,
  accentForeground: lightTokens.accentForeground,
  destructive: lightTokens.destructive,
  destructiveFill: lightTokens.destructiveFill,
  border: lightTokens.border,
  input: lightTokens.input,
  ring: lightTokens.ring,
  sidebar: lightTokens.sidebar,
  sidebarForeground: lightTokens.sidebarForeground,
  sidebarBorder: lightTokens.sidebarBorder,
  sidebarAccent: lightTokens.sidebarAccent,
  sidebarAccentForeground: lightTokens.sidebarAccentForeground,
  link: lightTokens.link,
  success: lightTokens.success,
  warning: lightTokens.warning,
  statusWorking: lightTokens.statusWorking,
  unread: lightTokens.unread,
  workingDot: lightTokens.workingDot,
  overlay: "#00002C73",
  scrollbar: lightTokens.scrollbar,
  scrollbarHover: lightTokens.scrollbarHover,
};

/** Identity swatches. Ids stay so stored avatar choices still resolve. */
const botPalette = [
  {
    id: "white",
    name: "Vanilla",
    light: vanilla,
    dark: "#E4E3C8",
    eyeColor: midnight,
    hex: vanilla,
  },
  {
    id: "violet",
    name: "Purple",
    light: "#C7A6FF",
    dark: "#6E32D6",
    eyeColor: "#FFFFFF",
    hex: purple,
  },
  { id: "green", name: "Mint", light: mint, dark: mintOnVanilla, eyeColor: midnight, hex: mint },
  {
    id: "orange",
    name: "Orange",
    light: "#FF9A4A",
    dark: "#C4560C",
    eyeColor: "#FFFFFF",
    hex: orange,
  },
  { id: "cyan", name: "Teal", light: teal, dark: "#0E8A86", eyeColor: midnight, hex: teal },
  {
    id: "blue",
    name: "Midnight Purple",
    light: "#8B6CFF",
    dark: "#3A1CA8",
    eyeColor: "#FFFFFF",
    hex: "#5B2EE0",
  },
  {
    id: "yellow",
    name: "Yellow",
    light: yellow,
    dark: "#8A8800",
    eyeColor: midnight,
    hex: "#C6C200",
  },
  {
    id: "brown",
    name: "Ember",
    light: "#C56A2A",
    dark: "#6A2C08",
    eyeColor: vanilla,
    hex: "#8A3A0C",
  },
  {
    id: "red",
    name: "Deep Orange",
    light: "#E06A28",
    dark: "#8E3008",
    eyeColor: "#FFFFFF",
    hex: "#C2410C",
  },
  { id: "magenta", name: "Pink", light: pink, dark: "#A84E8E", eyeColor: midnight, hex: pink },
  {
    id: "gray",
    name: "Slate",
    light: "#8A8AA0",
    dark: "#3E3E54",
    eyeColor: "#FFFFFF",
    hex: "#5C5C78",
  },
  {
    id: "pink",
    name: "Berry",
    light: "#E08CC8",
    dark: "#8E3A74",
    eyeColor: "#FFFFFF",
    hex: "#C45AA8",
  },
];

const legacyBotHex = {
  "#8B5CF6": purple,
  "#10B981": mint,
  "#F97316": orange,
  "#EAB308": "#C6C200",
  "#3B82F6": "#5B2EE0",
  "#06B6D4": teal,
  "#EC4899": pink,
  "#8D6E63": "#8A3A0C",
};

const organicColors = [purple, orange, teal, pink, "#5B2EE0", "#C6C200", mint];
const uiBotColors = [purple, mint, orange, teal, pink, yellow, "#C45AA8"];

const logoBodyPath = "M12 40C12 2 88 2 88 40L88 108H12Z";
const logoLeftHandPath = roundedRect(18, 58, 34, 18, 8);
const logoRightHandPath = roundedRect(48, 76, 34, 18, 8);

const wwwVars = {
  "--page": vanilla,
  "--surface": "#FFFFFF",
  "--surface-soft": "#F3F2DE",
  "--ink": midnight,
  "--body": "#1A1A42",
  "--muted": "#5C5C78",
  "--muted-2": "#4A4A64",
  "--line": "#E4E2CC",
  "--line-2": "#D9D7C0",
  "--blue": purpleOnVanilla,
  "--blue-top": purple,
  "--blue-bottom": purpleOnVanilla,
  "--blue-soft": "#F3EEFF",
  "--blue-soft-2": "#E4D8FF",
  "--blue-line": "#D4C4FF",
  "--panel": midnight,
  "--panel-2": "#121244",
  "--panel-line": "#2A2A5C",
  "--panel-line-2": "#34346A",
  "--panel-copy": vanilla,
  "--panel-muted": "#C8C7B4",
  "--panel-muted-2": "#A8A794",
  "--panel-cream": vanilla,
  "--panel-cream-ink": midnight,
  "--success": mintOnVanilla,
  "--coral": orange,
  "--coral-soft": "#FFE4D4",
  "--indigo": purple,
  "--indigo-soft": "#EDE4FF",
  "--green": mintOnVanilla,
  "--green-soft": "#D4F8E8",
  "--amber": orange,
  "--amber-soft": "#FFE8D0",
  "--violet": purple,
  "--violet-soft": "#EDE4FF",
  "--rose": pink,
  "--rose-soft": "#FBE4F4",
};

function roundedRect(x, y, w, h, r) {
  const x2 = x + w;
  const y2 = y + h;
  return `M${x + r} ${y}H${x2 - r}Q${x2} ${y} ${x2} ${y + r}V${y2 - r}Q${x2} ${y2} ${x2 - r} ${y2}H${x + r}Q${x} ${y2} ${x} ${y2 - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
}

function contrastRatio(a, b) {
  const rgb = (hex) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
  const alpha = a.length === 9 ? Number.parseInt(a.slice(7, 9), 16) / 255 : 1;
  const backdrop = rgb(b.startsWith("rgba") ? "#000000" : b);
  const foreground = rgb(a).map((c, i) => c * alpha + backdrop[i] * (1 - alpha));
  const luminance = (channels) =>
    channels.reduce((sum, value, i) => {
      const c = value / 255;
      return (
        sum +
        [0.2126, 0.7152, 0.0722][i] * (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
      );
    }, 0);
  const la = luminance(foreground);
  const lb = luminance(backdrop);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function assertBrandContrast() {
  const problems = [];
  const check = (label, ratio, min) => {
    if (ratio < min) problems.push(`${label} ${ratio.toFixed(2)} < ${min}`);
  };
  const ios = contrastRatio("#FFFFFF", "#F2F2F7");
  check("light card vs page", contrastRatio(lightTokens.card, lightTokens.background), ios);
  const skip = new Set([
    "chatUserForeground",
    "destructiveForeground",
    "destructiveFill",
    "faviconPlate",
    "unread",
    "workingDot",
  ]);
  for (const key of Object.keys(darkTokens)) {
    if (!skip.has(key) && darkTokens[key] === lightTokens[key]) problems.push(`same ${key}`);
  }
  if (darkTokens.sidebar === darkTokens.background) problems.push("dark sidebar");
  if (lightTokens.sidebar === lightTokens.background) problems.push("light sidebar");
  if (darkTokens.chatUser === darkTokens.muted) problems.push("dark chat");
  if (lightTokens.chatUser === lightTokens.muted) problems.push("light chat");
  if (darkTokens.link !== darkTokens.statusWorking) problems.push("dark status");
  if (lightTokens.link !== lightTokens.statusWorking) problems.push("light status");
  if (darkTokens.link === darkTokens.primary) problems.push("dark link is primary");
  if (lightTokens.link === lightTokens.primary) problems.push("light link is primary");
  if (darkTokens.workingDot !== lightTokens.workingDot) problems.push("working dot");
  const textPairs = [
    ["foreground", "background"],
    ["foreground", "dialog"],
    ["cardForeground", "card"],
    ["popoverForeground", "popover"],
    ["foreground", "muted"],
    ["chatUserForeground", "chatUser"],
    ["chatUserForeground", "unread"],
    ["primaryForeground", "primary"],
    ["sidebarForeground", "sidebar"],
    ["sidebarAccentForeground", "sidebarAccent"],
    ["link", "background"],
    ["link", "card"],
    ["destructive", "background"],
    ["destructive", "card"],
    ["success", "background"],
    ["success", "card"],
  ];
  for (const palette of [darkTokens, lightTokens]) {
    for (const [text, surface] of textPairs) {
      check(`${text} on ${surface}`, contrastRatio(palette[text], palette[surface]), 4.5);
    }
  }
  for (const surface of ["background", "card", "muted"]) {
    const faint = contrastRatio(lightTokens.faintForeground, lightTokens[surface]);
    const secondary = contrastRatio(lightTokens.mutedForeground, lightTokens[surface]);
    check(`faint on ${surface}`, faint, 3);
    if (secondary - faint < 1) problems.push(`light text gap on ${surface}`);
    check(
      `dark faint on ${surface}`,
      contrastRatio(darkTokens.faintForeground, darkTokens[surface]),
      3,
    );
  }
  const webDark = { ...darkTokens, ...webDarkOverrides };
  const webLight = { ...lightTokens, ...webLightOverrides };
  if (webDark.mutedForeground === darkTokens.mutedForeground) problems.push("web dark muted");
  if (webLight.mutedForeground === lightTokens.mutedForeground) problems.push("web light muted");
  for (const [palette, name] of [
    [webDark, "web dark"],
    [webLight, "web light"],
  ]) {
    for (const surface of ["background", "card"]) {
      check(
        `${name} muted on ${surface}`,
        contrastRatio(palette.mutedForeground, palette[surface]),
        4.5,
      );
      check(`${name} link on ${surface}`, contrastRatio(palette.link, palette[surface]), 4.5);
      check(
        `${name} success on ${surface}`,
        contrastRatio(palette.success, palette[surface]),
        name === "web light" && surface === "card" ? 0 : 4.5,
      );
      if (!(name === "web light" && surface === "card")) {
        check(
          `${name} warning on ${surface}`,
          contrastRatio(palette.warning, palette[surface]),
          4.5,
        );
      }
    }
  }
  for (const color of uiBotColors) {
    check(`bot ${color} on dark`, contrastRatio(color, darkTokens.background), 3);
    check(`bot ${color} on muted`, contrastRatio(color, darkTokens.muted), 3);
  }
  const yellowSwatch = botPalette.find((color) => color.id === "yellow");
  const brightness = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
    return (r * 299 + g * 587 + b * 114) / 1000;
  };
  if (brightness(yellowSwatch.hex) > 180)
    problems.push("yellow swatch is bright enough for the heuristic");
  if (yellowSwatch.eyeColor !== midnight) problems.push("yellow eyes");
  if (!assertLogoPath(logoBodyPath)) problems.push("logo body path failed the smoothness contract");
  if (problems.length) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
}

function assertLogoPath(d) {
  const numbers = (part) => [...part.matchAll(/-?\d+(?:\.\d+)?/g)].map(([n]) => Number(n));
  const point = (values, offset = 0) => [values[offset] ?? NaN, values[offset + 1] ?? NaN];
  let start = point(numbers(d.split("C")[0] ?? ""));
  const segments = [...d.matchAll(/C([^CLHZ]+)/g)].map(([, part]) => {
    const values = numbers(part ?? "");
    const points = [start, point(values), point(values, 2), point(values, 4)];
    start = points[3];
    return points;
  });
  if (segments.length > 12) return false;
  for (const [a, b, c, end] of segments) {
    for (let step = 0; step <= 50; step++) {
      const t = step / 50;
      const y =
        (1 - t) ** 3 * a[1] +
        3 * (1 - t) ** 2 * t * b[1] +
        3 * (1 - t) * t ** 2 * c[1] +
        t ** 3 * end[1];
      if (y >= 12) continue;
      const velocity = (i) =>
        3 * (1 - t) ** 2 * (b[i] - a[i]) +
        6 * (1 - t) * t * (c[i] - b[i]) +
        3 * t ** 2 * (end[i] - c[i]);
      const acceleration = (i) =>
        6 * (1 - t) * (c[i] - 2 * b[i] + a[i]) + 6 * t * (end[i] - 2 * c[i] + b[i]);
      const curvature =
        (velocity(0) * acceleration(1) - velocity(1) * acceleration(0)) /
        Math.hypot(velocity(0), velocity(1)) ** 3;
      if (!(curvature > 0 && curvature < 0.08)) return false;
    }
  }
  return segments.length > 0;
}

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function write(rel, next) {
  const abs = join(root, rel);
  const prev = existsSync(abs) ? readFileSync(abs, "utf8") : null;
  if (prev === next) return false;
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, next);
  return true;
}

function patchObjectLiteral(source, exportName, values) {
  const marker = `export const ${exportName} = {`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${exportName}`);
  const brace = source.indexOf("{", start);
  let depth = 0;
  let end = brace;
  for (let i = brace; i < source.length; i++) {
    if (source[i] === "{") depth += 1;
    else if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  let body = source.slice(brace + 1, end);
  const present = new Set(
    [...body.matchAll(/\b([A-Za-z][A-Za-z0-9]*):/g)].map((match) => match[1]),
  );
  const missing = [];
  for (const [key, value] of Object.entries(values)) {
    const re = new RegExp(`(\\b${key}:\\s*)(?:"[^"]*"|rgba\\([^)]*\\))`);
    if (!re.test(body)) missing.push(key);
    else body = body.replace(re, `$1"${value}"`);
  }
  const extra = [...present].filter((key) => !(key in values));
  if (missing.length) console.warn(`fiwe: ${exportName} is missing ${missing.join(", ")}`);
  if (extra.length) console.warn(`fiwe: ${exportName} has unbranded keys ${extra.join(", ")}`);
  return source.slice(0, brace + 1) + body + source.slice(end);
}

function formatSnapshot(name, values, indent) {
  const lines = Object.entries(values).map(([key, value]) => {
    const literal = value.startsWith("rgba") ? `"${value}"` : `"${value}"`;
    return `${indent}  ${key}: ${literal},`;
  });
  return `${indent}const ${name} = {\n${lines.join("\n")}\n${indent}}`;
}

function replaceBlock(source, name, replacement) {
  const marker = `const ${name} = {`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing snapshot ${name}`);
  const brace = source.indexOf("{", start);
  let depth = 0;
  let end = brace;
  for (let i = brace; i < source.length; i++) {
    if (source[i] === "{") depth += 1;
    else if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const lineStart = source.lastIndexOf("\n", start) + 1;
  const indent = source.slice(lineStart, start);
  const next = formatSnapshot(name, replacement, indent);
  return source.slice(0, lineStart) + next + source.slice(end + 1);
}

function paletteSource() {
  const rows = botPalette
    .map((color) => {
      const fields = ["id", "name", "light", "dark", "eyeColor", "hex"]
        .map((key) => `    ${key}: "${color[key]}",`)
        .join("\n");
      return `  {\n${fields}\n  },`;
    })
    .join("\n");
  return `[\n${rows}\n]`;
}

function replaceBracketExport(source, exportName, arrayLiteral) {
  const marker = `export const ${exportName}`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${exportName}`);
  const equals = source.indexOf("=", start);
  const bracket = source.indexOf("[", equals === -1 ? start : equals);
  let depth = 0;
  let end = bracket;
  for (let i = bracket; i < source.length; i++) {
    if (source[i] === "[") depth += 1;
    else if (source[i] === "]") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  return source.slice(0, bracket) + arrayLiteral + source.slice(end + 1);
}

function colorArray(colors) {
  return `[\n${colors.map((color) => `  "${color}",`).join("\n")}\n]`;
}

function patchLogoArt(source) {
  let next = source.replace(
    "/** Smooth cubic fit to the canonical silhouette; no raster image is embedded. */",
    "/** Rounded geometric body with a broad dome. No raster image is embedded. */",
  );
  next = next.replace(
    /export const LOGO_BODY_PATH =\n?\s*"[^"]*";/,
    `export const LOGO_BODY_PATH = "${logoBodyPath}";`,
  );
  next = next.replace(
    /export const LOGO_LEFT_HAND_PATH = "[^"]*";/,
    `export const LOGO_LEFT_HAND_PATH = "${logoLeftHandPath}";`,
  );
  next = next.replace(
    /export const LOGO_RIGHT_HAND_PATH = "[^"]*";/,
    `export const LOGO_RIGHT_HAND_PATH = "${logoRightHandPath}";`,
  );
  next = next.replace(
    'const raw = originalOrange ? "#ff7b08" : full;',
    "const raw = full;\n  void originalOrange;",
  );
  next = next.replace('flank: originalOrange ? "#c14d08" : shade(0.58),', "flank: shade(0.58),");
  next = next.replace(
    'contact: originalOrange ? "#961b00" : shade(0.42),',
    "contact: shade(0.42),",
  );
  next = next.replace(
    `rim: originalOrange
      ? "#fff1dc"
      : \`#\${rgb`,
    "rim: `#${rgb",
  );
  for (const baked of ["#ff7b08", "#c14d08", "#961b00", "#fff1dc"]) {
    if (next.includes(baked))
      console.warn(`fiwe: baked orange ${baked} remains in logo-avatar-art.ts`);
  }
  return next;
}

function replaceProductName(text) {
  let next = text.replace(/\bRakazo's\b/g, `${productName}'`);
  next = next.replace(/\bRakazo\b(?!\/\d)(?!\.(?:icon|com|git)\b)/g, (match, offset, str) =>
    str[offset - 1] === "." ? match : productName,
  );
  if (previousName && previousName !== productName && previousName !== "Rakazo") {
    next = next.split(previousName).join(productName);
  }
  const study = `${productName.toUpperCase()} · LOGO AVATAR STUDY`;
  const studyTag = `<p className="mb-1 text-label text-muted-foreground">\n              ${study}\n            </p>`;
  next = next.replaceAll(
    '<p className="mb-1 text-label text-muted-foreground">RAKAZO · LOGO AVATAR STUDY</p>',
    studyTag,
  );
  next = next.replaceAll(
    `<p className="mb-1 text-label text-muted-foreground">${study}</p>`,
    studyTag,
  );
  if (!/\s/.test(productName)) return next;
  const escaped = productName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const key = new RegExp(`(^|[\\n,{])(\\s*)${escaped}(\\s*:)`, "g");
  return next.replace(key, `$1$2${JSON.stringify(productName)}$3`);
}

function walk(dir, visit) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") continue;
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, visit);
    else visit(abs);
  }
}

const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".css",
  ".html",
  ".json",
  ".astro",
  ".md",
  ".xml",
  ".plist",
  ".yml",
  ".yaml",
  ".txt",
  ".po",
]);

function isTextFile(abs) {
  const ext = abs.slice(abs.lastIndexOf("."));
  if (!textExtensions.has(ext)) return false;
  const size = statSync(abs).size;
  return size > 0 && size < 1_500_000;
}

const nameRoots = [
  "apps/web",
  "apps/www",
  "apps/desktop",
  "apps/mobile",
  "apps/api/src",
  "packages/auth/src",
  "packages/ui-web/src",
];

const nameExtra = [
  "apps/api/src/marketing-email.ts",
  "apps/api/src/marketing-email.test.ts",
  "apps/api/src/welcome-email.postgres.test.ts",
  "apps/api/src/email.ts",
  "apps/api/src/email.test.ts",
  "apps/api/src/referral-email.ts",
  "apps/api/src/referral-email.test.ts",
  "apps/api/src/referral-email.postgres.test.ts",
  "packages/core/src/run-error.ts",
  "packages/core/src/run-error.test.ts",
  "packages/core/src/secrets-guard.ts",
  "packages/adapters/src/user-device-gateway.ts",
  "packages/adapters/src/pi-models.ts",
  "packages/adapters/src/pi-models.test.ts",
  "packages/adapters/src/pi-oauth.ts",
  "packages/adapters/src/pi-runtime.ts",
  "packages/adapters/src/pi-runtime-subagent.ts",
  "packages/adapters/src/pi-runtime-helper-framing.test.ts",
  "packages/adapters/src/run-instructions.ts",
  "packages/adapters/src/run-tools-user-computer.ts",
  "packages/adapters/src/executor-readonly-approval.test.ts",
  "packages/adapters/src/stripe-billing.ts",
  "packages/adapters/src/mcp-oauth.ts",
  "packages/adapters/src/mcp-oauth.test.ts",
  "packages/adapters/src/mcp-transport.ts",
  "packages/adapters/src/mcp-transport.test.ts",
  "packages/adapters/src/payment-wallets.ts",
  "packages/adapters/src/payment-wallets.test.ts",
  "packages/adapters/src/payment-wallet-conformance.test.ts",
  "packages/adapters/src/user-device-gateway.ts",
  "packages/adapters/src/user-device-gateway.test.ts",
  "packages/contracts/src/openai-compatible-ui.ts",
  "packages/testkit/src/cli/desktop-performance.ts",
];

function shouldRewriteHex(rel) {
  if (rel.startsWith("fiwe/")) return false;
  const skip = new Set([
    "packages/ui-tokens/src/index.ts",
    "packages/ui-tokens/src/tokens.css",
    "packages/core/src/bot-avatar-colors.ts",
    "packages/contracts/src/ids.ts",
  ]);
  if (skip.has(rel)) return false;
  return (
    /\.(test|spec)\.[cm]?[jt]sx?$/.test(rel) ||
    rel.includes("/e2e/") ||
    rel.endsWith("bot-avatar.tsx") ||
    rel.endsWith("bot-avatar.ts") ||
    rel.endsWith("builtin-tools.ts") ||
    rel.endsWith("demo.ts") ||
    rel.endsWith("ProductDemo.tsx") ||
    rel.endsWith("home.ts")
  );
}

function rewriteLegacyHex(text) {
  let next = text;
  for (const [from, to] of Object.entries(legacyBotHex)) {
    next = next.split(from).join(to);
    next = next.split(from.toLowerCase()).join(to.toLowerCase());
  }
  return next;
}

function welcomeBlock() {
  return `        {/* fiwe:welcome */}
        <div className="flex flex-col items-center gap-5">
          <img
            src="/brand/fiwe-wordmark-black.svg"
            alt=""
            className="h-9 w-auto dark:hidden sm:h-11"
          />
          <img
            src="/brand/fiwe-wordmark-vanilla.svg"
            alt=""
            className="hidden h-9 w-auto dark:block sm:h-11"
          />
          <h1 className="text-center text-[40px] font-bold leading-none tracking-[-0.03em] text-foreground sm:text-[56px]">
            ${productName}
          </h1>
        </div>
        {/* /fiwe:welcome */}`;
}

function patchWelcome(source) {
  const begin = "{/* fiwe:welcome */}";
  const end = "{/* /fiwe:welcome */}";
  const block = welcomeBlock();
  if (source.includes(begin)) {
    const start = source.indexOf(begin);
    const stop = source.indexOf(end);
    if (stop < 0) throw new Error("Welcome marker is not closed");
    const lineStart = source.lastIndexOf("\n", start) + 1;
    return source.slice(0, lineStart) + block + source.slice(stop + end.length);
  }
  const old = `        <div className="flex items-center gap-[18px] sm:gap-[26px]">
          <div className="flex size-16 items-center justify-center gap-[9px] rounded-full bg-accent sm:size-[88px] sm:gap-[13px]">
            <span className="h-[17px] w-2 rounded-full bg-card sm:h-6 sm:w-[11px]" />
            <span className="h-[17px] w-2 rounded-full bg-card sm:h-6 sm:w-[11px]" />
          </div>
          <h1 className="text-[56px] leading-none tracking-[-0.03em] text-foreground sm:text-[76px]">
            Rakazo
          </h1>
        </div>`;
  if (!source.includes(old)) {
    console.warn("fiwe: welcome mark was not found; the product name is still replaced");
    return source;
  }
  return source.replace(old, block);
}

function wordmarkBlock() {
  return `export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img src="/brand/fiwe-wordmark-black.svg" alt="" className="h-7 w-auto dark:hidden" />
      <img src="/brand/fiwe-wordmark-vanilla.svg" alt="" className="hidden h-7 w-auto dark:block" />
      <span className="text-[28px] font-bold tracking-tight text-foreground">${productName}</span>
    </div>
  );
}`;
}

function patchWordmark(source) {
  const begin = "export function Wordmark";
  const start = source.indexOf(begin);
  if (start < 0) {
    console.warn("fiwe: Wordmark was not found");
    return source;
  }
  const end = source.indexOf("\n}", start);
  if (end < 0) return source;
  return source.slice(0, start) + wordmarkBlock() + source.slice(end + 2);
}

function patchUiWebCss(source) {
  let next = source;
  if (!next.includes('font-family: "Rethink Sans"')) {
    const face = `@font-face {
  font-family: "Rethink Sans";
  src: url("./fonts/RethinkSans-Variable.ttf") format("truetype");
  font-weight: 400 800;
  font-style: normal;
  font-display: swap;
}

`;
    const anchor = '@import "@rakazo/ui-tokens/css";\n';
    if (!next.includes(anchor)) console.warn("fiwe: ui-web font import anchor was not found");
    else next = next.replace(anchor, `${anchor}\n${face}`);
  }
  next = next.replace(/--font-sans:\s*[^;]+;/, `--font-sans: ${fontStack};`);
  if (!next.includes("/* fiwe-type */")) {
    const anchor = `:root[data-os="mac"] {
  --font-weight-normal: 420;
}
`;
    const rule = `${anchor}
/* fiwe-type */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 700;
}
`;
    if (!next.includes(anchor)) console.warn("fiwe: heading insertion point was not found");
    else next = next.replace(anchor, rule);
  }
  return next;
}

function patchWwwCss(source) {
  let next = source;
  if (!next.includes('font-family: "Rethink Sans"')) {
    const face = `@font-face {
  font-family: "Rethink Sans";
  src: url("/fonts/RethinkSans-Variable.ttf") format("truetype");
  font-weight: 400 800;
  font-style: normal;
  font-display: swap;
}

`;
    next = face + next;
  }
  next = next.replace(/font-family:\s*[^;]*;/g, (decl) => {
    if (/mono|Geist Mono/i.test(decl)) return decl;
    if (!/Aeonik|Geist|ui-sans-serif/.test(decl)) return decl;
    return `font-family: ${fontStack};`;
  });
  const start = next.indexOf(":root {");
  if (start < 0) return next;
  const brace = next.indexOf("{", start);
  const end = next.indexOf("}", brace);
  let body = next.slice(brace + 1, end);
  for (const [key, value] of Object.entries(wwwVars)) {
    const re = new RegExp(`(${key}:\\s*)#[0-9a-fA-F]+`);
    if (!re.test(body)) console.warn(`fiwe: www is missing ${key}`);
    else body = body.replace(re, `$1${value}`);
  }
  return next.slice(0, brace + 1) + body + next.slice(end);
}

function patchThemeJs(source) {
  return source.replace(
    /theme === "light" \? "#[0-9a-fA-F]+" : "#[0-9a-fA-F]+"/,
    `theme === "light" ? "${vanilla.toLowerCase()}" : "${midnight.toLowerCase()}"`,
  );
}

function copyFont(relDir) {
  const dir = join(root, relDir);
  mkdirSync(dir, { recursive: true });
  copyFileSync(
    join(fiweDir, "assets/fonts/RethinkSans-Variable.ttf"),
    join(dir, "RethinkSans-Variable.ttf"),
  );
  copyFileSync(join(fiweDir, "assets/fonts/OFL.txt"), join(dir, "OFL.txt"));
}

function copyWordmarks() {
  const pairs = [
    ["apps/web/public/brand", "fiwe-wordmark-black.svg"],
    ["apps/web/public/brand", "fiwe-wordmark-vanilla.svg"],
    ["apps/www/public/brand", "fiwe-wordmark-black.svg"],
    ["apps/www/public/brand", "fiwe-wordmark-vanilla.svg"],
  ];
  for (const [dir, name] of pairs) {
    const dest = join(root, dir);
    mkdirSync(dest, { recursive: true });
    copyFileSync(join(fiweDir, "assets/wordmarks", name), join(dest, name));
  }
}

function symbolSvg(fill) {
  const source = readFileSync(join(fiweDir, "assets/wordmarks/fiwe-wordmark-black.svg"), "utf8");
  const paths = [...source.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)]
    .slice(0, 2)
    .map((match) => match[1]);
  if (paths.length !== 2) throw new Error("Could not crop the F-mark from the wordmark");
  const body = paths.map((d) => `<path fill="${fill}" d="${d}"/>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.63 11.57" fill="${fill}">
  ${body}
</svg>`;
}

async function loadSharp() {
  const require = createRequire(join(root, "packages/ui-tokens/package.json"));
  return require("sharp");
}

async function renderIcons() {
  const sharp = await loadSharp();
  const scale = 80;
  const width = Math.ceil(51.63 * scale);
  const height = Math.ceil(11.57 * scale);
  const rendered = await sharp(Buffer.from(symbolSvg(vanilla)))
    .resize(width, height)
    .ensureAlpha()
    .png()
    .toBuffer();
  const trimmed = await sharp(rendered).trim().png().toBuffer({ resolveWithObject: true });
  const mark = trimmed.data;
  const info = trimmed.info;
  const viewX = -(info.trimOffsetLeft ?? 0) / scale;
  const viewY = -(info.trimOffsetTop ?? 0) / scale;
  const viewW = info.width / scale;
  const viewH = info.height / scale;
  const pad = Math.max(viewW, viewH) * 0.18;
  const side = Math.max(viewW, viewH) + pad * 2;
  const originX = viewX - (side - viewW) / 2;
  const originY = viewY - (side - viewH) / 2;
  const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${originX} ${originY} ${side} ${side}">
  <rect x="${originX}" y="${originY}" width="${side}" height="${side}" fill="${midnight}"/>
  ${symbolSvg(vanilla)
    .replace(/^<\?xml[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")}
</svg>`;
  for (const rel of ["apps/web/public/favicon.svg", "apps/www/public/favicon.svg"]) {
    write(rel, faviconSvg);
  }

  async function plate(background, paddingRatio) {
    const canvas = 1024;
    const inner = Math.round(canvas * (1 - paddingRatio * 2));
    const fitted = await sharp(mark)
      .resize({ width: inner, height: inner, fit: "inside" })
      .png()
      .toBuffer();
    const fittedMeta = await sharp(fitted).metadata();
    const left = Math.round((canvas - fittedMeta.width) / 2);
    const top = Math.round((canvas - fittedMeta.height) / 2);
    let image = sharp({
      create: { width: canvas, height: canvas, channels: 4, background },
    }).composite([{ input: fitted, left, top }]);
    if (!background) image = image.ensureAlpha();
    return image.png().toBuffer();
  }

  const square = await plate(midnight, 0.16);
  const transparent = await plate({ r: 0, g: 0, b: 0, alpha: 0 }, 0.16);
  const mask = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" rx="200" fill="white"/></svg>',
  );
  const rounded = await sharp(square)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  async function png(input, rel, size) {
    const dest = join(root, rel);
    mkdirSync(dirname(dest), { recursive: true });
    await sharp(input).resize(size, size).png().toFile(dest);
  }
  async function ico(input, rel, sizes) {
    const frames = await Promise.all(
      sizes.map((size) => sharp(input).resize(size).png().toBuffer()),
    );
    const header = Buffer.alloc(6 + frames.length * 16);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(frames.length, 4);
    let offset = header.length;
    frames.forEach((frame, index) => {
      const entry = 6 + index * 16;
      header[entry] = header[entry + 1] = sizes[index] === 256 ? 0 : sizes[index];
      header.writeUInt16LE(1, entry + 4);
      header.writeUInt16LE(32, entry + 6);
      header.writeUInt32LE(frame.length, entry + 8);
      header.writeUInt32LE(offset, entry + 12);
      offset += frame.length;
    });
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), Buffer.concat([header, ...frames]));
  }

  for (const app of ["web", "www"]) {
    const publicDir = `apps/${app}/public`;
    await png(rounded, `${publicDir}/favicon-16x16.png`, 16);
    await png(rounded, `${publicDir}/favicon-32x32.png`, 32);
    await png(rounded, `${publicDir}/favicon.png`, 128);
    await png(square, `${publicDir}/apple-touch-icon.png`, 180);
    await png(square, `${publicDir}/icon-192.png`, 192);
    await png(square, `${publicDir}/icon-512.png`, 512);
    await ico(rounded, `${publicDir}/favicon.ico`, [16, 32, 48]);
  }
  mkdirSync(join(root, "apps/www/public/brand"), { recursive: true });
  await png(square, "apps/www/public/brand/rakazo-mark.png", 256);
  await png(rounded, "apps/mobile/assets/favicon.png", 128);
  await png(square, "apps/desktop/assets/icon.png", 1024);
  await png(square, "apps/desktop/assets/icon-macos.png", 1024);
  await ico(rounded, "apps/desktop/assets/icon.ico", [16, 32, 48, 64, 128, 256]);
  await png(square, "apps/mobile/assets/icon.png", 1024);
  await png(square, "apps/mobile/assets/icon-background.png", 1024);
  await png(transparent, "apps/mobile/assets/adaptive-icon.png", 1024);
  const whiteMark = await sharp(Buffer.from(symbolSvg("#FFFFFF")))
    .resize(width, height)
    .ensureAlpha()
    .trim()
    .png()
    .toBuffer();
  const mono = await plateFrom(sharp, whiteMark, { r: 0, g: 0, b: 0, alpha: 0 }, 0.16);
  await png(mono, "apps/mobile/assets/monochrome-icon.png", 1024);
  await png(mono, "packages/ui-tokens/assets/Rakazo.icon/Assets/orange-bot.png", 1024);
  const silhouette = await sharp(mono).resize(72, 72).extractChannel("alpha").toBuffer();
  const notification = await sharp({
    create: { width: 72, height: 72, channels: 3, background: "white" },
  })
    .joinChannel(silhouette)
    .png()
    .toBuffer();
  writeFileSync(join(root, "apps/mobile/assets/notification-icon.png"), notification);
  const splashMark = await plateFrom(sharp, mark, { r: 0, g: 0, b: 0, alpha: 0 }, 0.22);
  await sharp(splashMark)
    .resize(620, 620)
    .extend({ top: 202, bottom: 202, left: 202, right: 202, background: "transparent" })
    .png()
    .toFile(join(root, "apps/mobile/assets/splash-icon.png"));
}

async function plateFrom(sharp, mark, background, paddingRatio) {
  const canvas = 1024;
  const inner = Math.round(canvas * (1 - paddingRatio * 2));
  const fitted = await sharp(mark)
    .resize({ width: inner, height: inner, fit: "inside" })
    .png()
    .toBuffer();
  const fittedMeta = await sharp(fitted).metadata();
  const left = Math.round((canvas - fittedMeta.width) / 2);
  const top = Math.round((canvas - fittedMeta.height) / 2);
  return sharp({
    create: { width: canvas, height: canvas, channels: 4, background },
  })
    .composite([{ input: fitted, left, top }])
    .png()
    .toBuffer();
}

function patchIconComposer(source) {
  return source.replace(/"translation-in-points":\s*\[[^\]]+\]/, '"translation-in-points": [0, 0]');
}

assertBrandContrast();

let changed = 0;
function commit(rel, next) {
  if (write(rel, next)) {
    changed += 1;
    console.log(`updated ${rel}`);
  }
}

let tokens = read("packages/ui-tokens/src/index.ts");
tokens = patchObjectLiteral(tokens, "darkTokens", darkTokens);
tokens = patchObjectLiteral(tokens, "lightTokens", lightTokens);
tokens = patchObjectLiteral(tokens, "webDarkOverrides", webDarkOverrides);
tokens = patchObjectLiteral(tokens, "webLightOverrides", webLightOverrides);
tokens = tokens.replace(
  /export const botEyeColor = "#[^"]+";/,
  `export const botEyeColor = "${midnight}";`,
);
tokens = replaceBracketExport(tokens, "botColors", colorArray(uiBotColors));
commit("packages/ui-tokens/src/index.ts", tokens);

let appearance = read("packages/ui-tokens/src/appearance.test.ts");
appearance = replaceBlock(appearance, "mobileDark", darkTokens);
appearance = replaceBlock(appearance, "mobileLight", lightTokens);
appearance = appearance.replace(/(workingDot\)\.toBe\(")#[^"]+("\))/, `$1${mint}$2`);
appearance = appearance.replace(
  /primaryHover: "#[^"]+"/,
  `primaryHover: "${webDarkOverrides.primaryHover}"`,
);
appearance = appearance.replace(
  /primaryDisabled: "#[^"]+"/,
  `primaryDisabled: "${webDarkOverrides.primaryDisabled}"`,
);
const lightHover = appearance.lastIndexOf('primaryHover: "');
if (lightHover >= 0) {
  appearance =
    appearance.slice(0, lightHover) +
    appearance
      .slice(lightHover)
      .replace(/primaryHover: "#[^"]+"/, `primaryHover: "${webLightOverrides.primaryHover}"`);
}
const lightDisabled = appearance.lastIndexOf('primaryDisabled: "');
if (lightDisabled >= 0) {
  appearance =
    appearance.slice(0, lightDisabled) +
    appearance
      .slice(lightDisabled)
      .replace(
        /primaryDisabled: "#[^"]+"/,
        `primaryDisabled: "${webLightOverrides.primaryDisabled}"`,
      );
}
commit("packages/ui-tokens/src/appearance.test.ts", appearance);

let colors = read("packages/core/src/bot-avatar-colors.ts");
colors = replaceBracketExport(colors, "BOT_COLOR_LIST", paletteSource());
commit("packages/core/src/bot-avatar-colors.ts", colors);
commit(
  "packages/core/src/logo-avatar-art.ts",
  patchLogoArt(read("packages/core/src/logo-avatar-art.ts")),
);

let ids = read("packages/contracts/src/ids.ts");
ids = replaceBracketExport(ids, "BOT_COLORS", colorArray(organicColors));
commit("packages/contracts/src/ids.ts", ids);

commit("apps/web/src/pages/Welcome.tsx", patchWelcome(read("apps/web/src/pages/Welcome.tsx")));
commit(
  "packages/ui-web/src/bot-avatar.tsx",
  patchWordmark(read("packages/ui-web/src/bot-avatar.tsx")),
);
commit("packages/ui-web/src/styles.css", patchUiWebCss(read("packages/ui-web/src/styles.css")));
commit("apps/www/src/styles/global.css", patchWwwCss(read("apps/www/src/styles/global.css")));
commit("apps/web/public/theme.js", patchThemeJs(read("apps/web/public/theme.js")));

let indexHtml = read("apps/web/index.html");
indexHtml = indexHtml.replace(
  /(<meta name="theme-color" content=")#[^"]+(")/,
  `$1${midnight.toLowerCase()}$2`,
);
commit("apps/web/index.html", indexHtml);

let logoAstro = read("apps/www/src/components/Logo.astro");
logoAstro = logoAstro.replace(
  /class="brand-lockup__word">[^<]*</,
  `class="brand-lockup__word">${productName}<`,
);
commit("apps/www/src/components/Logo.astro", logoAstro);

const iconJson = "packages/ui-tokens/assets/Rakazo.icon/icon.json";
commit(iconJson, patchIconComposer(read(iconJson)));

let persona = read("packages/core/src/bot-avatar-colors.test.ts");
persona = persona.replace('chatUserBubbleColors("#FFFFFF"', `chatUserBubbleColors("${vanilla}"`);
persona = persona.replace('eyeColor).toBe("#141414")', `eyeColor).toBe("${midnight}")`);
commit("packages/core/src/bot-avatar-colors.test.ts", persona);

const seen = new Set();
function rewriteFile(rel) {
  if (seen.has(rel) || !existsSync(join(root, rel)) || !isTextFile(join(root, rel))) return;
  seen.add(rel);
  if (!shouldRewriteHex(rel)) return;
  commit(rel, rewriteLegacyHex(read(rel)));
}
walk(root, (abs) => rewriteFile(relative(root, abs)));

for (const rel of ["apps/desktop/src/window-options.ts", "apps/desktop/src/main.ts"]) {
  commit(rel, read(rel).replaceAll('backgroundColor: "#161616"', `backgroundColor: "${midnight}"`));
}
commit(
  "apps/mobile/lib/color.test.ts",
  read("apps/mobile/lib/color.test.ts")
    .replaceAll('"rgba(20, 20, 20, 0)"', '"rgba(0, 0, 44, 0)"')
    .replaceAll('"rgba(252, 252, 252, 0)"', '"rgba(255, 254, 232, 0)"')
    .replaceAll('"rgba(0, 0, 0, 0)"', '"rgba(0, 0, 44, 0)"')
    .replaceAll('"rgba(60, 60, 67, 0.3)"', '"rgba(0, 0, 44, 0.3)"')
    .replaceAll('"rgba(235, 235, 245, 0.3)"', '"rgba(255, 254, 232, 0.3)"'),
);
commit(
  "apps/mobile/lib/bot-avatar.test.ts",
  read("apps/mobile/lib/bot-avatar.test.ts").replace(
    'expect(presented.eyeColor).toBe("#141414")',
    `expect(presented.eyeColor).toBe("${midnight}")`,
  ),
);
commit(
  "apps/mobile/lib/name-dialog-compose.test.tsx",
  read("apps/mobile/lib/name-dialog-compose.test.tsx")
    .replaceAll('"#FFFFFF33"', '"#FFFEE833"')
    .replaceAll('"#FFFFFF"', '"#FFFEE8"'),
);
commit(
  "apps/mobile/lib/native-switch-compose.test.tsx",
  read("apps/mobile/lib/native-switch-compose.test.tsx").replace(
    `["light", "#34C759", "#7676801F", "#F2F2F1", "#6C6C70"],
    ["dark", "#30D158", "#7676803D", "#EBEBF599", "transparent"],`,
    `["light", "#34C759", "#00002C0F", "#E6E4CE", "#6B2BD4"],
    ["dark", "#30D158", "#FFFEE814", "#FFFEE8B8", "transparent"],`,
  ),
);
commit(
  "packages/core/src/bot-avatar-colors.ts",
  read("packages/core/src/bot-avatar-colors.ts").replace(
    'eyeColor: isBright ? "#141414" : "#FFFFFF"',
    `eyeColor: isBright ? "${midnight}" : "#FFFFFF"`,
  ),
);

const avatarChoice = "packages/db/src/bot-avatar-choice.test.ts";
commit(
  avatarChoice,
  read(avatarChoice)
    .replace(
      'const spread = ["#3EC5A8", "#6A6BF5", "#9B5CF6", "#F2622A", "#D9508A"];',
      'const spread = ["#9A4DFF", "#1FFFF8", "#E788CE", "#C6C200", "#47FF9A"];',
    )
    .replace('{ id: round!, color: "#F5A03C" },', '{ id: round!, color: "#F36F16" },'),
);

const named = new Set();
function renameFile(rel) {
  if (named.has(rel) || !existsSync(join(root, rel)) || !isTextFile(join(root, rel))) return;
  named.add(rel);
  commit(rel, replaceProductName(read(rel)));
}
for (const rel of nameRoots) walk(join(root, rel), (abs) => renameFile(relative(root, abs)));
for (const rel of nameExtra) renameFile(rel);
for (const rel of ["apps/api/src"]) {
  walk(join(root, rel), (abs) => {
    if (abs.includes("email")) renameFile(relative(root, abs));
  });
}

copyFont("packages/ui-web/src/fonts");
copyFont("apps/web/public/fonts");
copyFont("apps/www/public/fonts");
copyWordmarks();
writeFileSync(appliedPath, `${productName}\n`);

const generate = spawnSync("pnpm", ["--filter", "@rakazo/ui-tokens", "generate"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, CI: "1" },
});
if (generate.status !== 0) {
  console.error("fiwe: token CSS was not regenerated. Re-run after dependencies are installed.");
  process.exit(generate.status ?? 1);
}

try {
  await renderIcons();
  console.log("updated icons");
} catch (error) {
  console.error("fiwe: icons were not written. Re-run after dependencies are installed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

console.log(`fiwe brand applied (${changed} text files, product “${productName}”)`);
