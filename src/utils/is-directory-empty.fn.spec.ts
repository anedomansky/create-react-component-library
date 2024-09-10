import { test, expect, vi } from "vitest";
import { isDirectoryEmpty } from "./is-directory-empty.fn";
import fs from "node:fs";

test("should check if a directory is empty", () => {
  vi.spyOn(fs, "readdirSync").mockReturnValueOnce([]);
  const directory = "src/utils";
  expect(isDirectoryEmpty(directory)).toBe(true);
});

test("should check if a directory has .git folder in it", () => {
  vi.mock("fs/readdirSync", () => ({
    readFileSync: () => [".git"],
  }));
  const directory = "src/utils";
  expect(isDirectoryEmpty(directory)).toBe(false);
});
