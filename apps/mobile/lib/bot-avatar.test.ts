import { resolvePersonaColorDef, shippedBotAvatarShapePath } from "@rakazo/core";
import { describe, expect, it } from "vitest";
import { mobileBotAvatarPresentation } from "./bot-avatar.js";

describe("mobile bot avatar presentation", () => {
  it("keeps the stored shape path instead of dropping it to a color fill", () => {
    const presented = mobileBotAvatarPresentation("#9A4DFF::shape_3");
    expect(presented).toEqual({
      kind: "shape",
      color: "#9A4DFF",
      shapeIndex: 3,
      shapePath: shippedBotAvatarShapePath(3),
      eyeColor: resolvePersonaColorDef("preview", "#9A4DFF").eyeColor,
    });
    expect(presented.kind === "shape" && presented.shapePath).not.toBe(
      shippedBotAvatarShapePath(0),
    );
  });

  it("uses the shared palette eye color for Amber Gold", () => {
    const presented = mobileBotAvatarPresentation("#C6C200::shape_1");
    expect(presented.kind).toBe("shape");
    if (presented.kind !== "shape") return;
    expect(presented.eyeColor).toBe("#00002C");
    expect(presented.eyeColor).toBe(resolvePersonaColorDef("preview", "#C6C200").eyeColor);
  });

  it("still treats hex, data images, and remote URLs as before", () => {
    expect(mobileBotAvatarPresentation("#9A4DFF")).toEqual({ kind: "color", color: "#9A4DFF" });
    expect(mobileBotAvatarPresentation("data:image/png;base64,abc")).toEqual({
      kind: "image",
      imageUrl: "data:image/png;base64,abc",
    });
    expect(mobileBotAvatarPresentation("https://evil.example/track.png")).toEqual({
      kind: "other",
      raw: "https://evil.example/track.png",
    });
  });
});
