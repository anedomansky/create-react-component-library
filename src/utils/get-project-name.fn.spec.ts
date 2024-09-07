import { test, expect, vi } from "vitest";
import { getProjectName } from "./get-project-name.fn";
import path from "node:path";

test("should return the correct project name", () => {
  const pathSpy = vi.spyOn(path, "basename").mockReturnValueOnce("project");
  const pathResolveSpy = vi
    .spyOn(path, "resolve")
    .mockReturnValueOnce("/path/to/project");
  const directory = ".";

  const result = getProjectName(directory);

  expect(pathSpy).toHaveBeenCalledTimes(1);
  expect(pathResolveSpy).toHaveBeenCalledTimes(1);
  expect(pathSpy).toHaveBeenCalledWith("/path/to/project");
  expect(result).toBe("project");
});

test("should return the correct project name", () => {
  const directory = "/path/to/project";

  const result = getProjectName(directory);

  expect(result).toBe("/path/to/project");
});
