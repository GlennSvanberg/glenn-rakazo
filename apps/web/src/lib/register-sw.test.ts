import { describe, expect, it, vi } from "vitest";
import { registerServiceWorker } from "./register-sw";

type Target = Parameters<typeof registerServiceWorker>[0];

function fakeTarget() {
  const register = vi.fn().mockResolvedValue(undefined);
  const target = {
    addEventListener: () => {},
    navigator: { serviceWorker: { register } },
  } as unknown as Target;
  return { register, target };
}

describe("registerServiceWorker", () => {
  it("does nothing outside production builds", () => {
    const { register, target } = fakeTarget();
    registerServiceWorker(target, false);
    expect(register).not.toHaveBeenCalled();
  });

  it("registers /sw.js in production builds", () => {
    const { register, target } = fakeTarget();
    registerServiceWorker(target, true);
    expect(register).toHaveBeenCalledWith("/sw.js");
  });

  it("never throws when registration fails", async () => {
    const { register, target } = fakeTarget();
    register.mockRejectedValue(new Error("denied"));
    expect(() => registerServiceWorker(target, true)).not.toThrow();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(register).toHaveBeenCalledWith("/sw.js");
  });
});
