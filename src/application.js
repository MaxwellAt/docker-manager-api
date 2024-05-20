const dockerAPI = require("./dockerAPI");

/* 
config: {
  applicationName: node-postgres,
  backend: {
    cpu:  
    ram: 
  },
  database: {
    cpu:
    ram: 
  }
}
*/

function Application(config) {
  let filename = "";
  let filepath = "";
  let portNumber = "";
  let applicationName = config.applicationName;
  let backend = {
    cpu: config.backend.cpu,
    ram: config.backend.ram,
  };
  let database = {
    cpu: config.database.cpu,
    ram: config.database.ram,
  };

  async function run() {
    const fileInfo = await dockerAPI.createComposeFile(applicationName);
    const config = await dockerAPI.createConfig(backend, database);
    const composer = await dockerAPI.runComposeFile(fileInfo);

    filename = composer.composerFile;
    filepath = composer.composerPath;
    portNumber = composer.port;

    return {
      conf: applicationName,
      composerFile: filename,
      backend,
      database,
      port: portNumber,
      remove,
    };
  }

  async function remove() {
    try {
      await dockerAPI.removeComposerFile(filepath);

      return { success: true, message: "File was removed successfully!" };
    } catch (err) {
      return {
        success: false,
        message: "Something went wrong! Try again later.",
        err,
      };
    }
  }

  function getInfo() {
    return {
      filepath,
      portNumber,
      backend,
      database,
    };
  }

  return { run, remove, getInfo };
}

module.exports = {
  Application,
};
