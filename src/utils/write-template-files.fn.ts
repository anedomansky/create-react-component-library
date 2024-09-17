import fs from "node:fs";
import path from "node:path";

const filesToRename: Record<string, string> = {
  _gitignore: ".gitignore",
};

/**
 * Copies template files from source directory to destination directory.
 * If the source is a directory, it recursively copies all files and subdirectories.
 * If the source is a file, it copies the file to the destination.
 *
 * @param src - The path of the source directory or file.
 * @param dest - The path of the destination directory or file.
 */
export function copyTemplateFiles(src: string, dest: string) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    const files = fs.readdirSync(src, { encoding: "utf-8" });

    for (let i = 0; i < files.length; i++) {
      const srcFile = path.join(src, files[i]);
      const destFile = path.join(dest, files[i]);
      copyTemplateFiles(srcFile, destFile);
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

/**
 * Writes template files to the specified target directory.
 * If the content is provided, it writes the content to the target file.
 * Otherwise, it copies the template file from the source directory to the target directory.
 *
 * @param file - The name of the file to be written or copied.
 * @param rootDir - The root directory path.
 * @param targetDir - The target directory path.
 * @param content - The content to be written to the target file (optional).
 */
export function writeTemplateFiles(
  file: string,
  rootDir: string,
  targetDir: string,
  content?: string
) {
  const targetPath = path.join(targetDir, filesToRename[file] ?? file);

  if (content) {
    fs.writeFileSync(targetPath, content, { encoding: "utf-8" });
  } else {
    copyTemplateFiles(path.join(rootDir, file), targetPath);
  }
}
