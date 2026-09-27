// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

vi.mock("@lingui/react/macro", () => {
  const t = (parts: TemplateStringsArray) => parts.join("");
  return { useLingui: () => ({ t }) };
});

import { AppRail } from "./AppRail";

function renderRail(props: { active: "bots" | "artifacts"; className?: string }) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <MemoryRouter>
        <AppRail {...props} />
      </MemoryRouter>,
    );
  });
  const nav = container.querySelector('[data-testid="app-rail"]') as HTMLElement;
  return { container, nav, cleanup: () => act(() => root.unmount()) };
}

describe("AppRail", () => {
  it("links both sections and marks the active one", () => {
    const { nav, cleanup } = renderRail({ active: "bots" });
    const links = nav.querySelectorAll("a");
    expect(links).toHaveLength(2);
    expect(nav.querySelector('a[aria-current="page"]')?.getAttribute("href")).toBe("/app");
    expect(nav.querySelector('a[href="/app/artifacts"]')).not.toBeNull();
    cleanup();
  });

  it("passes extra layout classes through to the nav", () => {
    const { nav, cleanup } = renderRail({ active: "bots", className: "hidden md:flex" });
    expect(nav.className).toContain("hidden");
    expect(nav.className).toContain("md:flex");
    cleanup();
  });

  it("keeps the base rail layout without extra classes", () => {
    const { nav, cleanup } = renderRail({ active: "artifacts" });
    expect(nav.className).toContain("w-14");
    expect(nav.className).not.toContain("hidden");
    expect(nav.querySelector('a[aria-current="page"]')?.getAttribute("href")).toBe(
      "/app/artifacts",
    );
    cleanup();
  });
});
