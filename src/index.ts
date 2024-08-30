import minimist from "minimist";
import path from "node:path";

// Parse the command line arguments
const argv = minimist(process.argv.slice(2));

async function init() {
  const argDirectory = argv._[0];
  const projectName = path.basename(path.resolve());
}

init().catch(console.error);
