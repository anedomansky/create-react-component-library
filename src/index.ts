import minimist from "minimist";
import path from "node:path";
import prompts from "prompts";

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

/**
 * Remove trailing slashes from the directory path
 * @param directory - The directory path
 * @returns The cleaned directory path
 */
function prepareDirectory(directory: string) {
  return directory.trim().replaceAll(/\/+$/g, "");
}

function getProjectName(directory: string) {
  return directory === "." ? path.basename(path.resolve()) : directory;
}

async function init() {
  const help = argv.help;

  if (help) {
    console.info(helpNotification);
    return;
  }

  const defaultDirectory = "component-library-project";

  const argDirectory = prepareDirectory(argv._[0]);
  const directory = argDirectory || defaultDirectory;

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
          onState: (state) => prepareDirectory(state.value) || defaultDirectory,
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

  const { projectName } = result;
}

init().catch(console.error);
