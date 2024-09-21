import { test, expect } from "vitest";
import { prepareDirectory } from "./prepare-directory.fn";

test("should remove trailing '/' from directory", () => {
  const directory = "/path/to/directory/";
  const cleaned = prepareDirectory(directory);
  expect(cleaned).toBe("/path/to/directory");
});

test("should remove sourrounding whitespaces", () => {
  const directory = "  /path/to/directory/  ";
  const cleaned = prepareDirectory(directory);
  expect(cleaned).toBe("/path/to/directory");
});

test("should do nothing", () => {
  const directory = "/path/to/directory";
  const cleaned = prepareDirectory(directory);
  expect(cleaned).toBe("/path/to/directory");
});

test("should return null if directory is null", () => {
  const directory = null;
  const cleaned = prepareDirectory(directory);
  expect(cleaned).toBeNull();
});
