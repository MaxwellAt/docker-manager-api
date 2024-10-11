const config = require("./config").getHardwareInfo();
const fs = require("fs");
const os = require("os");
const writeFile = require("node:util").promisify(fs.writeFile);
const readFile = require("node:util").promisify(fs.readFile);
const path = require("path");
const mustache = require("mustache");

const { TEST_FOLDER } = config.paths;
const { types } = config.applications;

function getFilename(application, type) {
  let { backend, database } = application;
  let filename = `${application.conf}`;
  filename += `_${backend.cpu}_${backend.ram}`;
  filename += `_${database.cpu}_${database.ram}`;
  filename += `_${type}`;

  return path.join(os.tmpdir(), `${filename}.js`);
}

async function generateScript(url, type, application, method) {
  // TO-DO: Need to check type is a valid option
  if (!types.includes(type)) return { success: false };

  let template = await readFile(
    path.join(TEST_FOLDER, `${type}.js`),
    "utf-8"
  );

  if(method!="ALL"){
    let path_name = method.toUpperCase() + "_FOLDER";
    template = await readFile(
      path.join(config.paths[path_name], `${type}.js`),
      "utf-8"
    )
  }

  const fileContent = mustache.render(template, { url });

  try {
    const filename = getFilename(application, type);
    await writeFile(filename, fileContent, "utf-8");
    return { success: true, value: filename };
  } catch (e) {
    return { success: false, value: e };
  }
}

module.exports = {
  generateScript,
};
