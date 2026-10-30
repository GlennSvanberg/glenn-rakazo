import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GroupAvatar } from "./group-avatar.js";

describe("GroupAvatar", () => {
  it("renders fallback squad icon when no members provided", () => {
    const html = renderToString(<GroupAvatar members={[]} />);
    expect(html).toContain("<svg");
  });

  it("renders single BotAvatar when 1 member", () => {
    const html = renderToString(<GroupAvatar members={[{ name: "Harry", color: "#9A4DFF" }]} />);
    expect(html).toContain("rakazo-organic-avatar");
  });

  it("renders 2 overlapping bot avatars for 2 members", () => {
    const html = renderToString(
      <GroupAvatar
        members={[
          { name: "Sherlock", color: "#9A4DFF" },
          { name: "Elon", color: "#1FFFF8" },
        ]}
      />,
    );
    const count = (html.match(/data-working=/g) || []).length;
    expect(count).toBe(2);
    expect(html).toContain('data-working="false"');
  });

  it("renders a working member inside a group avatar", () => {
    const html = renderToString(
      <GroupAvatar
        members={[
          { name: "Sherlock", color: "#9A4DFF", status: "running" },
          { name: "Elon", color: "#1FFFF8", status: "idle" },
        ]}
      />,
    );
    expect(html).toContain('data-working="true"');
    expect(html).toContain("rakazo-organic-avatar");
  });

  it("renders 3 mini bot avatars for 3 members", () => {
    const html = renderToString(
      <GroupAvatar
        members={[
          { name: "Sherlock", color: "#9A4DFF" },
          { name: "Elon", color: "#1FFFF8" },
          { name: "Penny", color: "#E788CE" },
        ]}
      />,
    );
    const count = (html.match(/data-working=/g) || []).length;
    expect(count).toBe(3);
  });

  it("renders 2 mini avatars + overflow count for 4+ members", () => {
    const html = renderToString(
      <GroupAvatar
        members={[
          { name: "Sherlock", color: "#9A4DFF" },
          { name: "Elon", color: "#1FFFF8" },
          { name: "Penny", color: "#E788CE" },
          { name: "Harry", color: "#47FF9A" },
        ]}
      />,
    );
    expect(html).toContain("+2");
  });
});
