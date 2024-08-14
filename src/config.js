const os = require("node:os");
const path = require("node:path");

const symbols = {
  K: 2 ** 10,
  M: 2 ** 20,
  G: 2 ** 30,
};

module.exports = {
  API_URL: `http://localhost`,
  PORT: 8000,
  paths: {
    ENV_FILE: "./config.env",
    TMP_FOLDER: "./tmp",
    COMPOSER_FOLDER: "./composers",
    CONFIG_FILE: "./config.env",
    TEST_FOLDER: path.join(__dirname, "..", "test_files"),
  },
  machine: {
    MINIMUN_CPU: 0.1,
    MAXIMUN_CPU: os.cpus().length,
    MINIMUN_RAM: 100 * symbols.M,
    MAXIMUN_RAM: 1 * symbols.G,
  },
  applications: {
    types: ["smoke", "stress", "breakpoint", "spike", "load", "soak"],
  },
};
