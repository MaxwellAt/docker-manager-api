const fs = require("fs");
const os = require("os");
const writeFile = require("node:util").promisify(fs.writeFile);
const readFile = require("node:util").promisify(fs.readFile);
const path = require("path");
const mustache = require("mustache");

const TEST_FILE_FOLDER = path.join(__dirname, "..", "test_files");
const types = ["smoke", "stress", "breakpoint", "spike", "load", "soak"];

async function generateScript(url, type) {
  // TO-DO: Need to check type is a valid option
  if (!types.includes(type)) return { success: false };

  const template = await readFile(
    path.join(TEST_FILE_FOLDER, `${type}.mustache`),
    "utf-8"
  );

  const fileContent = mustache.render(template, { url });

  try {
    const filename = path.join(os.tmpdir(), `${type}_test.js`);
    await writeFile(filename, fileContent, "utf-8");
    return { success: true, value: filename };
  } catch (e) {
    return { success: false, value: e };
  }
}

module.exports = {
  generateScript,
};
