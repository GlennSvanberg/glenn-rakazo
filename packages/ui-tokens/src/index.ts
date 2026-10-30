export const APPEARANCE_PREFERENCES = ["system", "light", "dark"] as const;

export type AppearancePreference = (typeof APPEARANCE_PREFERENCES)[number];

export type ResolvedAppearance = "light" | "dark";

export const UI_APPEARANCE_STORAGE_KEY = "rakazo.uiAppearance";

/**
 * Semantic palette shared by web, Electron, and Expo. Names follow the shadcn
 * convention so the same slot means the same thing on every surface: a `border`
 * is always a border and never a fill.
 */
export type ColorTokens = {
  background: string;
  /** Modals: a step lighter than the page so they read as raised above it. */
  dialog: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  /** Fill and hairline where native Liquid Glass is unavailable (Android, iOS before 26). */
  glassFill: string;
  glassStroke: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  chatUser: string;
  /** White in both themes: the user bubble is a solid fill (light grey in dark, near-black in light). */
  chatUserForeground: string;
  muted: string;
  mutedForeground: string;
  /** Tertiary text: placeholders, list markers, quote bars, timestamps. */
  faintForeground: string;
  accent: string;
  accentForeground: string;
  /** Destructive text and outlines. */
  destructive: string;
  /** Solid destructive fill (Hang up, a filled Delete); its text is `destructiveForeground`. */
  destructiveFill: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarBorder: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  link: string;
  /** Backing behind a link's site icon. White in both themes so dark logos stay visible on any bubble. */
  faviconPlate: string;
  success: string;
  warning: string;
  statusWorking: string;
  /** Unread dot. The one blue in the inbox, in both themes. */
  unread: string;
  /** Working dot on a busy bot's avatar. The one green, in both themes. */
  workingDot: string;
  overlay: string;
  scrollbar: string;
  scrollbarHover: string;
};

export const darkTokens = {
  background: "#00002C",
  dialog: "#16164A",
  foreground: "#FFFEE8",
  card: "#14143E",
  cardForeground: "#FFFEE8",
  popover: "#16164A",
  popoverForeground: "#FFFEE8",
  glassFill: "#1C1C4E",
  glassStroke: "#FFFEE826",
  primary: "#FFFEE8",
  primaryForeground: "#00002C",
  secondary: "#FFFEE814",
  secondaryForeground: "#FFFEE8",
  chatUser: "#2A2A5C",
  chatUserForeground: "#FFFEE8",
  muted: "#101038",
  mutedForeground: "#FFFEE8B8",
  faintForeground: "#FFFEE89E",
  accent: "#9A4DFF33",
  accentForeground: "#FFFEE8",
  destructive: "#E788CE",
  destructiveFill: "#8E2F6A",
  destructiveForeground: "#FFFEE8",
  border: "#FFFEE81F",
  input: "#FFFEE838",
  ring: "#A45FFD",
  sidebar: "#00001A",
  sidebarForeground: "#FFFEE8",
  sidebarBorder: "#FFFEE81A",
  sidebarAccent: "#3A1C78",
  sidebarAccentForeground: "#FFFEE8",
  link: "#A45FFD",
  faviconPlate: "#FFFFFF",
  success: "#47FF9A",
  warning: "#F36F16",
  statusWorking: "#A45FFD",
  unread: "#5A24C4",
  workingDot: "#47FF9A",
  overlay: "rgba(0, 0, 44, 0.72)",
  scrollbar: "#FFFEE838",
  scrollbarHover: "#FFFEE880",
} as const satisfies ColorTokens;

export const lightTokens = {
  background: "#FFFEE8",
  dialog: "#FFFFFF",
  foreground: "#00002C",
  card: "#EDECDB",
  cardForeground: "#00002C",
  popover: "#FFFFFF",
  popoverForeground: "#00002C",
  glassFill: "#FFFFFF",
  glassStroke: "#00002C16",
  primary: "#00002C",
  primaryForeground: "#FFFEE8",
  secondary: "#00002C0F",
  secondaryForeground: "#00002C",
  chatUser: "#00002C",
  chatUserForeground: "#FFFEE8",
  muted: "#E6E4CE",
  mutedForeground: "#00002C9E",
  faintForeground: "#00002C8C",
  accent: "#9A4DFF1A",
  accentForeground: "#00002C",
  destructive: "#9A2068",
  destructiveFill: "#8E2F6A",
  destructiveForeground: "#FFFEE8",
  border: "#00002C1F",
  input: "#00002C3D",
  ring: "#6B2BD4",
  sidebar: "#E0DEC8",
  sidebarForeground: "#00002C",
  sidebarBorder: "#00002C1F",
  sidebarAccent: "#FFFFFF",
  sidebarAccentForeground: "#00002C",
  link: "#6B2BD4",
  faviconPlate: "#FFFFFF",
  success: "#0B7A45",
  warning: "#A3470C",
  statusWorking: "#6B2BD4",
  unread: "#5A24C4",
  workingDot: "#47FF9A",
  overlay: "rgba(0, 0, 44, 0.45)",
  scrollbar: "#00002C3D",
  scrollbarHover: "#00002C85",
} as const satisfies ColorTokens;

/** Web and Electron only: the primary fill's hover and disabled states. Mobile has no hover. */
export type WebColorTokens = ColorTokens & {
  primaryHover: string;
  primaryDisabled: string;
};

/**
 * Web and Electron values for the tokens they draw differently from the palettes above, which
 * follow the iOS system design for mobile. Mobile reads `darkTokens` / `lightTokens`; web reads
 * `tokens.css`, rendered from these merged palettes. Surfaces are opaque; text, borders, hover
 * and selection are the ink at an opacity, so they read the same on every surface.
 */
export const webDarkOverrides = {
  background: "#00002C",
  dialog: "#16164A",
  foreground: "#FFFEE8",
  card: "#14143E",
  cardForeground: "#FFFEE8",
  popover: "#16164A",
  popoverForeground: "#FFFEE8",
  primary: "#FFFEE8",
  primaryHover: "#E6E5CF",
  primaryDisabled: "#FFFEE833",
  primaryForeground: "#00002C",
  secondary: "#FFFEE814",
  secondaryForeground: "#FFFEE8",
  chatUser: "#2A2A5C",
  chatUserForeground: "#FFFEE8",
  muted: "#101038",
  mutedForeground: "#FFFEE8DB",
  faintForeground: "#FFFEE89E",
  accent: "#9A4DFF33",
  accentForeground: "#FFFEE8",
  destructive: "#E788CE",
  destructiveFill: "#8E2F6A",
  border: "#FFFEE81F",
  input: "#FFFEE838",
  ring: "#A45FFD",
  sidebar: "#00001A",
  sidebarForeground: "#FFFEE8",
  sidebarBorder: "#FFFEE81A",
  sidebarAccent: "#3A1C78",
  sidebarAccentForeground: "#FFFEE8",
  link: "#A45FFD",
  success: "#47FF9A",
  warning: "#F36F16",
  statusWorking: "#A45FFD",
  unread: "#5A24C4",
  workingDot: "#47FF9A",
  overlay: "#00002CB8",
  scrollbar: "#FFFEE838",
  scrollbarHover: "#FFFEE880",
} as const satisfies Partial<WebColorTokens>;

export const webLightOverrides = {
  background: "#FFFEE8",
  foreground: "#00002C",
  card: "#EDECDB",
  cardForeground: "#00002C",
  popoverForeground: "#00002C",
  primary: "#00002C",
  primaryHover: "#24244A",
  primaryDisabled: "#00002C26",
  primaryForeground: "#FFFEE8",
  secondary: "#00002C0F",
  secondaryForeground: "#00002C",
  chatUser: "#00002C",
  muted: "#E6E4CE",
  mutedForeground: "#00002CC7",
  faintForeground: "#00002C8C",
  accent: "#9A4DFF1A",
  accentForeground: "#00002C",
  destructive: "#9A2068",
  destructiveFill: "#8E2F6A",
  border: "#00002C1F",
  input: "#00002C3D",
  ring: "#6B2BD4",
  sidebar: "#E0DEC8",
  sidebarForeground: "#00002C",
  sidebarBorder: "#00002C1F",
  sidebarAccent: "#FFFFFF",
  sidebarAccentForeground: "#00002C",
  link: "#6B2BD4",
  success: "#0B7A45",
  warning: "#A3470C",
  statusWorking: "#6B2BD4",
  unread: "#5A24C4",
  workingDot: "#47FF9A",
  overlay: "#00002C73",
  scrollbar: "#00002C3D",
  scrollbarHover: "#00002C85",
} as const satisfies Partial<WebColorTokens>;

export const webDarkTokens: WebColorTokens = { ...darkTokens, ...webDarkOverrides };
export const webLightTokens: WebColorTokens = { ...lightTokens, ...webLightOverrides };

/** Dark palette. Prefer `tokensForAppearance` when theme-aware. */
export const tokens = darkTokens;

export const RADIUS = "0.75rem";

export const fontWeight = { regular: "400", medium: "500", semibold: "600" } as const;

/**
 * Native text styles on the system font, in points: iOS body text is 17/22. Titles use the
 * font's own line spacing, written out so they don't inherit a smaller body line height.
 */
export const typeScale = {
  title: { fontSize: 22, lineHeight: 26, fontWeight: fontWeight.semibold },
  headline: { fontSize: 19, lineHeight: 23, fontWeight: fontWeight.semibold },
  cardTitle: { fontSize: 17, lineHeight: 22, fontWeight: fontWeight.medium },
  body: { fontSize: 17, lineHeight: 22 },
  secondary: { fontSize: 15, lineHeight: 19 },
  caption: { fontSize: 14, lineHeight: 18 },
  footnote: { fontSize: 12, lineHeight: 16 },
} as const;

/**
 * Text grows with the iOS text size until body text reaches 23pt, the xxxLarge size. Larger
 * accessibility sizes keep that size, so message bubbles, rows and cards keep their layout.
 */
export const MAX_FONT_SCALE = 23 / typeScale.body.fontSize;

/** The ink of a drawn bot's eyes, the same on every body colour and in both themes. */
export const botEyeColor = "#00002C";

export const botColors = [
  "#9A4DFF",
  "#47FF9A",
  "#F36F16",
  "#1FFFF8",
  "#E788CE",
  "#F3F316",
  "#C45AA8",
] as const;

export function isAppearancePreference(
  value: string | null | undefined,
): value is AppearancePreference {
  return value === "system" || value === "light" || value === "dark";
}

export function normalizeAppearancePreference(
  raw: string | null | undefined,
): AppearancePreference {
  return isAppearancePreference(raw) ? raw : "system";
}

export type ResolveAppearancePreferenceOptions = {
  stored?: string | null;
  storage?: Pick<Storage, "getItem"> | null;
};

function getLocalStorage(): Pick<Storage, "getItem" | "setItem"> | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage : null;
  } catch {
    return null;
  }
}

export function resolveAppearancePreference(
  options: ResolveAppearancePreferenceOptions = {},
): AppearancePreference {
  const stored =
    options.stored !== undefined
      ? options.stored
      : readStoredAppearance(options.storage ?? getLocalStorage());
  return normalizeAppearancePreference(stored);
}

export function persistAppearancePreference(
  preference: AppearancePreference,
  storage: Pick<Storage, "setItem"> | null = getLocalStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(UI_APPEARANCE_STORAGE_KEY, preference);
  } catch {
    // Ignore quota / private-mode failures; in-memory preference still applies.
  }
}

export function resolveAppearance(
  preference: AppearancePreference,
  system: ResolvedAppearance = "dark",
): ResolvedAppearance {
  if (preference === "system") return system;
  return preference;
}

export function tokensForAppearance(appearance: ResolvedAppearance): ColorTokens {
  return appearance === "light" ? lightTokens : darkTokens;
}

/** The web and Electron palette; `tokensForAppearance` is the mobile one. */
export function webTokensForAppearance(appearance: ResolvedAppearance): WebColorTokens {
  return appearance === "light" ? webLightTokens : webDarkTokens;
}

function readStoredAppearance(storage: Pick<Storage, "getItem"> | null | undefined): string | null {
  if (!storage) return null;
  try {
    return storage.getItem(UI_APPEARANCE_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** `cardForeground` -> `--card-foreground` */
export function cssVariableName(token: keyof WebColorTokens): string {
  return `--${token.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
}

function renderBlock(selector: string, colorScheme: ResolvedAppearance, palette: WebColorTokens) {
  const lines = (Object.keys(palette) as (keyof WebColorTokens)[]).map(
    (token) => `  ${cssVariableName(token)}: ${palette[token].toLowerCase()};`,
  );
  return `${selector} {\n  color-scheme: ${colorScheme};\n${lines.join("\n")}\n  --radius: ${RADIUS};\n}`;
}

/** The CSS in `tokens.css` (web and Electron). Generated from the web palettes so both stay in sync. */
export function renderTokensCss(): string {
  return `${[
    "/* Generated by `pnpm --filter @rakazo/ui-tokens generate`. Edit src/index.ts instead. */",
    renderBlock(':root,\n[data-theme="dark"]', "dark", webDarkTokens),
    renderBlock('[data-theme="light"]', "light", webLightTokens),
  ].join("\n\n")}\n`;
}
