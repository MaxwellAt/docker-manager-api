const fs = require("fs");
const os = require("os");
const writeFile = require("node:util").promisify(fs.writeFile);
const readFile = require("node:util").promisify(fs.readFile);
const path = require("path");
const mustache = require("mustache");

const TEST_FILE_FOLDER = path.join(__dirname, "..", "test_files");
const types = ["smoke", "stress", "breakpoint", "spike", "load", "soak"];

function getFilename(application) {
  let { backend, database } = application;
  let filename = `${application.conf}`;
  filename += `_${backend.cpu}_${backend.ram}`;
  filename += `_${database.cpu}_${database.ram}`;

  return path.join(os.tmpdir(), `${filename}.js`);
}

async function generateScript(url, type, application) {
  // TO-DO: Need to check type is a valid option
  if (!types.includes(type)) return { success: false };

  const template = await readFile(
    path.join(TEST_FILE_FOLDER, `${type}.js`),
    "utf-8"
  );

  const fileContent = mustache.render(template, { url });

  try {
    const filename = getFilename(application);
    //const filename = path.join(os.tmpdir(), `${type}_test.js`);
    await writeFile(filename, fileContent, "utf-8");
    return { success: true, value: filename };
  } catch (e) {
    return { success: false, value: e };
  }
}

module.exports = {
  generateScript,
};
