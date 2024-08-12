const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const config = require("./config");

const { promisify } = require("node:util");
const exec = promisify(require("node:child_process").exec);
const writeFile = promisify(fs.writeFile);
const rmFile = promisify(fs.rm);

const { ENV_FILE, CONFIG_FILE, TMP_FOLDER, COMPOSER_FOLDER } = config.paths;

async function getContainerPort(container) {
  const command = `docker port ${container}-backend-1`;
  const result = await exec(command);

  const portReg = /:(\d+)/;
  const portNumber = result.stdout.match(portReg)[1];

  return portNumber;
}

async function createComposeFile(application) {
  // create file
  const fname = uuid.v1();
  const composerPath = path.join(COMPOSER_FOLDER, application);
  const command = `docker compose --env-file ${ENV_FILE} -p ${fname} -f ${composerPath}/docker-compose.yml config`;
  const result = await exec(command);

  const fpath = path.resolve(TMP_FOLDER, fname);
  await writeFile(fpath, result.stdout);

  return { fname, fpath };
}

async function runComposeFile({ fname, fpath }) {
  const command = `docker compose -f ${fpath} up -d`;
  const result = await exec(command);
  const port = await getContainerPort(fname);

  return {
    composerFile: fname,
    composerPath: fpath,
    port,
  };
}

async function removeComposerFile(composePath) {
  const command = `docker compose -f ${composePath} down`;
  const result = await exec(command);
  console.log(composePath);
  await rmFile(composePath);

  return result;
}

async function createConfig(backend, database) {
  await writeFile(
    CONFIG_FILE,
    `
# CPUS can receive fractions (ex: 0.5)
# MEMORY receive value measure (ex: 4M)

BK_CPUS=${backend.cpu}
BK_MEMORY=${backend.ram}
DB_CPUS=${database.cpu}
DB_MEMORY=${database.ram}
`
  );
}

module.exports = {
  removeComposerFile,
  runComposeFile,
  createComposeFile,
  createConfig,
};
