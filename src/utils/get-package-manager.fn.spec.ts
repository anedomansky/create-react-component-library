import { test, expect } from "vitest";
import { getPackageManager } from "./get-package-manager.fn";

test("should return null if no user agent is supplied", () => {
  const userAgent = undefined;

  const result = getPackageManager(userAgent);

  expect(result).toBe(null);
});

test("should return null if user agent is empty", () => {
  const userAgent = "";

  const result = getPackageManager(userAgent);

  expect(result).toBe(null);
});

test("should return package manager information", () => {
  const userAgent = "npm/7.20.3";

  const result = getPackageManager(userAgent);

  expect(result).toEqual({ name: "npm", version: "7.20.3" });
});
