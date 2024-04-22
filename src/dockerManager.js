const fs = require("fs");
const path = require("path");
const dockerAPI = require("./dockerAPI");
const COMPOSERS_FOLDER = "./composers";
const CONFIG_FILE = "./config.env";

const applications = [];

function getApplications() {
  return applications;
}

function getAvailablesConfigs() {
  return fs.readdirSync(COMPOSERS_FOLDER);
}

function initContainter(composeName) {
  if (getAvailablesConfigs.includes(composeName)) {
    dockerAPI.up();
  }
}

async function runComposer({ conf, backend, database }) {
  const finfo = await dockerAPI.createComposeFile(
    path.join(COMPOSERS_FOLDER, conf)
  );
  const config = await createConfig(backend, database);
  const compose = await dockerAPI.runComposeFile(finfo);
  const newApp = { ...compose, backend, database, conf };
  //await dockerAPI.allowPort(newApp.port);

  applications.push(newApp);

  return newApp;
}

async function removeComposer({ composerFile }) {
  const application = applications.find(
    (app) => app.composerFile === composerFile
  );
  if (application) {
    const index = applications.indexOf(application);
    applications.splice(index, 1);

    //await dockerAPI.denyPort(application.port);
    await dockerAPI.removeComposerFile(application.composerPath);
    fs.rmSync(application.composerPath);

    return { result: "FILE REMOVED" };
  }

  return { result: "FILE NOT FOUND" };
}

async function createConfig(backend, database) {
  fs.writeFileSync(
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
  runComposer,
  initContainter,
  getAvailablesConfigs,
  getApplications,
  removeComposer,
};
