import { test, expect } from "vitest";
import { isValidPackageName } from "./is-valid-package-name.fn";

test("should check if package name is valid", () => {
  const packageName = "valid-package-name";
  expect(isValidPackageName(packageName)).toBe(true);
});

test.each([".", "!", "?", "&", "#", "-", "+"])(
  "should have invalid package name",
  (packageNamePrefix) => {
    const packageName = `${packageNamePrefix}valid-package-name`;
    expect(isValidPackageName(packageName)).toBe(false);
  }
);
