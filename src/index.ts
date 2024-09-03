import minimist from "minimist";
import path from "node:path";
import prompts from "prompts";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { prepareDirectory } from "./utils/prepare-directory.fn";
import { getProjectName } from "./utils/get-project-name.fn";
import { isDirectoryEmpty } from "./utils/is-directory-empty.fn";
import { isValidPackageName } from "./utils/is-valid-package-name.fn";
import { createValidPackageName } from "./utils/create-valid-package-name.fn";
import { writeTemplateFiles } from "./utils/write-template-files.fn";

// Parse the command line arguments
const argv = minimist<{ help?: boolean }>(process.argv.slice(2), {
  alias: {
    help: "h",
  },
  default: {
    help: false,
  },
});

const helpNotification = `
Usage: create-react-component-library [DIRECTORY]

Create a new project that enables you to build a React component library with Vite and TypeScript.
With no [DIRECTORY] provided, the CLI will start and prompt the user for the [DIRECTORY].`;

async function init() {
  const help = argv.help;

  if (help) {
    console.info(helpNotification);
    return;
  }

  const defaultDirectory = "component-library-project";

  const argDirectory = prepareDirectory(argv._[0]);
  const directory = argDirectory || defaultDirectory;

  let result: prompts.Answers<"projectName" | "overwrite" | "packageName"> = {
    overwrite: "",
    packageName: "",
    projectName: "",
  };

  prompts.override({
    overwrite: argv.overwrite,
  });

  try {
    result = await prompts(
      [
        {
          type: argDirectory ? null : "text",
          name: "projectName",
          message: "Enter the project name:",
          initial: defaultDirectory,
          onState: (state) => prepareDirectory(state.value) || defaultDirectory,
        },
        {
          type:
            !fs.existsSync(directory) || isDirectoryEmpty(directory)
              ? null
              : "select",
          name: "overwrite",
          message:
            "The specified directory is not empty. Please select how to proceed:",
          initial: 0,
          choices: [
            {
              title: "Empty the directory and continue",
              value: "yes",
            },
            {
              title: "Cancel the operation",
              value: "no",
            },
            {
              title: "Continue without emptying the directory",
              value: "continue",
            },
          ],
        },
        {
          type: (_, { overwrite }: { overwrite?: string }) => {
            if (overwrite === "no") {
              throw new Error("The operation was cancelled.");
            }

            return null;
          },
          name: "overwriteResult",
        },
        {
          type: () =>
            isValidPackageName(getProjectName(directory)) ? null : "text",
          name: "packageName",
          message: "Enter the package name:",
          initial: createValidPackageName(getProjectName(directory)),
          validate: (dir) => isValidPackageName(dir) || "Invalid package name",
        },
      ],
      {
        onCancel: () => {
          throw new Error("The operation was cancelled.");
        },
      }
    );
  } catch (cancelledError) {
    console.warn((cancelledError as Error).message);
  }

  const { projectName, overwrite, packageName } = result;

  const rootDir = path.join(process.cwd(), directory);

  if (overwrite === "yes") {
    fs.rmSync(rootDir, { recursive: true, force: true });
  } else if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir, { recursive: true });
  }

  console.info(`Creating new React component library project in ${rootDir}...`);

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../template"
  );

  const files = fs
    .readdirSync(templateDir)
    .filter((file) => file !== "package.json");

  for (let i = 0; i < files.length; i++) {
    writeTemplateFiles(files[i], rootDir, templateDir);
  }

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(templateDir, "package.json"), "utf-8")
  );

  packageJson.name = packageName ?? projectName;

  writeTemplateFiles(
    "package.json",
    rootDir,
    templateDir,
    JSON.stringify(packageJson, null, 2) + "\n"
  );

  const directoryName = path.resolve(process.cwd(), rootDir);

  console.info(`\nProject created in "${directoryName}".\n`);
  console.info(`\nNow run cd "${directoryName}"\n`);
}

init().catch(console.error);
