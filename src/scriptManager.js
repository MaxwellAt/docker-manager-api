const fs = require("fs");
const os = require("os");
const writeFile = require("node:util").promisify(fs.writeFile);
const readFile = require("node:util").promisify(fs.readFile);
const path = require("path");
const mustache = require("mustache");

const types = ["smoke", "stress", "breakpoint", "spike", "load", "soak"];
const TEST_FILE_PATH = path.join(
  __dirname,
  "..",
  "test_files",
  "template.mustache"
);
const TEMP_FILE = path.join(os.tmpdir(), "test_download.js");

async function generateScript(url, type) {
  const template = await readFile(TEST_FILE_PATH, "utf-8");
  const fileContent = mustache.render(template, { url, type });

  try {
    await writeFile(TEMP_FILE, fileContent, "utf-8");
    return { success: true, value: TEMP_FILE };
  } catch (e) {
    return { success: false, value: e };
  }
}

module.exports = {
  generateScript,
};
