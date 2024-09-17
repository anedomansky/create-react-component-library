import { describe, it, expect, vi, beforeEach } from "vitest";
import { fs, vol } from "memfs";
import path from "node:path";
import {
  copyTemplateFiles,
  writeTemplateFiles,
} from "./write-template-files.fn";

vi.mock("node:fs");
vi.mock("node:fs/promises");
vi.mock("node:path");

describe("copyTemplateFiles", () => {
  beforeEach(() => {
    // reset the state of in-memory fs
    vol.reset();
  });

  it("should copy a file from source to destination", () => {
    const src = "src/file.txt";
    const dest = "dest/file.txt";

    fs.statSync.mockReturnValue({ isDirectory: () => false });
    copyTemplateFiles(src, dest);

    expect(fs.copyFileSync).toHaveBeenCalledWith(src, dest);
  });

  it("should copy a directory recursively", () => {
    const src = "src/dir";
    const dest = "dest/dir";

    fs.statSync.mockReturnValue({ isDirectory: () => true });
    fs.readdirSync.mockReturnValue(["file1.txt", "file2.txt"]);
    path.join.mockImplementation((...args) => args.join("/"));

    copyTemplateFiles(src, dest);

    expect(fs.mkdirSync).toHaveBeenCalledWith(dest, { recursive: true });
    expect(fs.readdirSync).toHaveBeenCalledWith(src);
    expect(fs.copyFileSync).toHaveBeenCalledTimes(2);
  });
});

describe("writeTemplateFiles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should write content to a file", () => {
    const file = "file.txt";
    const rootDir = "root";
    const targetDir = "target";
    const content = "Hello, World!";

    path.join.mockImplementation((...args) => args.join("/"));

    writeTemplateFiles(file, rootDir, targetDir, content);

    expect(fs.writeFileSync).toHaveBeenCalledWith("root/file.txt", content);
  });

  it("should copy a file from the template directory", () => {
    const file = "file.txt";
    const rootDir = "root";
    const targetDir = "target";

    path.join.mockImplementation((...args) => args.join("/"));

    writeTemplateFiles(file, rootDir, targetDir);

    expect(copyTemplateFiles).toHaveBeenCalledWith(
      "target/file.txt",
      "root/file.txt"
    );
  });

  it("should rename a file based on filesToRename", () => {
    const file = "_gitignore";
    const rootDir = "root";
    const targetDir = "target";

    path.join.mockImplementation((...args) => args.join("/"));

    writeTemplateFiles(file, rootDir, targetDir);

    expect(copyTemplateFiles).toHaveBeenCalledWith(
      "target/_gitignore",
      "root/.gitignore"
    );
  });
});
