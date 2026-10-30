import * as z from "zod";

export const Id = z.string().min(1);
export const IsoDate = z.string().datetime({ offset: true });

export const ActorSchema = z.object({
  userId: Id,
  spaceId: Id,
  email: z.string().email(),
  /** Deprecated wire field. App accounts have no deployment role; always false. */
  isDeploymentOwner: z.boolean(),
});
export type Actor = z.infer<typeof ActorSchema>;

export const BOT_COLORS = [
  "#9A4DFF",
  "#F36F16",
  "#1FFFF8",
  "#E788CE",
  "#5B2EE0",
  "#C6C200",
  "#47FF9A",
] as const;

export const RunStatus = z.enum([
  "queued",
  "leased",
  "running",
  "waiting_input",
  "waiting_takeover",
  "completed",
  "failed",
  "cancelled",
]);
export type RunStatus = z.infer<typeof RunStatus>;

export const EffectStatus = z.enum(["intended", "completed", "failed", "ambiguous", "reconciled"]);
export type EffectStatus = z.infer<typeof EffectStatus>;

export const MemoryScope = z.enum(["bot", "user"]);
export type MemoryScope = z.infer<typeof MemoryScope>;

export const SandboxKind = z.enum([
  "docker",
  "e2b",
  "novita",
  "daytona",
  "createos",
  "boat",
  "boxd",
  "railway",
  "kubernetes",
  "wuying",
  "desktop",
  "fake",
]);
export type SandboxKind = z.infer<typeof SandboxKind>;
