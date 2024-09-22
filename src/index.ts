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
import { getPackageManager } from "./utils/get-package-manager.fn";

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
  let directory = argDirectory ?? defaultDirectory;

  let result: prompts.Answers<"projectName" | "overwrite" | "packageName">;

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
          onState: (state) => {
            directory = prepareDirectory(state.value) ?? defaultDirectory;
          },
        },
        {
          type: (_, { projectName }: { projectName: string }) =>
            !fs.existsSync(projectName) || isDirectoryEmpty(projectName)
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
    return;
  }

  const { projectName, overwrite, packageName } = result;

  const projectRootDirectory = path.join(process.cwd(), directory);

  if (overwrite === "yes") {
    fs.rmSync(projectRootDirectory, { recursive: true, force: true });
    fs.mkdirSync(projectRootDirectory, { recursive: true });
  } else if (!fs.existsSync(projectRootDirectory)) {
    fs.mkdirSync(projectRootDirectory, { recursive: true });
  }

  console.info(
    `Creating new React component library project in ${projectRootDirectory}...`
  );

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../..",
    "template"
  );

  const files = fs
    .readdirSync(templateDir)
    .filter((file) => file !== "package.json");

  for (let i = 0; i < files.length; i++) {
    writeTemplateFiles(files[i], templateDir, projectRootDirectory);
  }

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(templateDir, "package.json"), "utf-8")
  );

  packageJson.name = packageName ?? projectName;

  writeTemplateFiles(
    "package.json",
    templateDir,
    projectRootDirectory,
    JSON.stringify(packageJson, null, 2) + "\n"
  );

  const directoryName = path.resolve(process.cwd(), projectRootDirectory);

  console.info(`\nProject created in "${directoryName}".`);
  console.info(`\nNow run cd "${directoryName}"`);

  const packageManagerInfo = getPackageManager(
    process.env.npm_config_user_agent
  );
  const packageManager = packageManagerInfo?.name ?? "npm";

  console.info(`\nThen run ${packageManager} install\n`);
}

init().catch(console.error);
