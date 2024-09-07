import { test, expect } from "vitest";
import { createValidPackageName } from "./create-valid-package-name.fn";

test("should replace all spaces with '-'", () => {
  const packageName = "package name";

  const validPackageName = createValidPackageName(packageName);

  expect(validPackageName).toBe("package-name");
});

test("should remove trailing and leading whitespace", () => {
  const packageName = " package name ";

  const validPackageName = createValidPackageName(packageName);

  expect(validPackageName).toBe("package-name");
});

test("should remove leading '.'", () => {
  const packageName = ".package name";

  const validPackageName = createValidPackageName(packageName);

  expect(validPackageName).toBe("package-name");
});

test("should remove leading '_'", () => {
  const packageName = "_package name";

  const validPackageName = createValidPackageName(packageName);

  expect(validPackageName).toBe("package-name");
});

test("should replace all non-alphanumeric characters with '-'", () => {
  const packageName = "package!@#$%^&*()name";

  const validPackageName = createValidPackageName(packageName);

  expect(validPackageName).toBe("package-name");
});
