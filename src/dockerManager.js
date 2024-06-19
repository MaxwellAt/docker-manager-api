const { promisify } = require("node:util");

const fs = require("fs");
const readdir = promisify(fs.readdir);

const COMPOSERS_FOLDER = "./composers";

const { Application } = require("./application");

const applications = [];

function getApplications() {
  return applications;
}

function getApplicationById(id) {
  return applications.find((app) => app.id == id);
}

async function getAvailablesConfigs() {
  return await readdir(COMPOSERS_FOLDER);
}

async function runComposer({ conf, backend, database }) {
  const newApplication = Application({
    applicationName: conf,
    backend,
    database,
  });

  const applicationInfo = await newApplication.run();
  applications.push(applicationInfo);

  return applicationInfo;
}

async function removeComposer({ composerFile }) {
  const application = applications.find(
    (app) => app.composerFile === composerFile
  );

  if (application) {
    const index = applications.indexOf(application);
    applications.splice(index, 1);

    await application.remove();

    return { success: true, result: "FILE REMOVED" };
  }

  return { success: false, result: "FILE NOT FOUND" };
}

module.exports = {
  runComposer,
  getAvailablesConfigs,
  getApplications,
  getApplicationById,
  removeComposer,
};
