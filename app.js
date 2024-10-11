const { getHardwareInfo } = require("./src/config");
const express = require("express");
const cors = require("cors");
const mustacheExpress = require("mustache-express");

const path = require("path");
const dockerManager = require("./src/dockerManager");
const scriptManager = require("./src/scriptManager");
const validation = require("./src/validation");

const app = express();
const { PORT, URL } = getHardwareInfo();

app.use(cors());

app.engine("mustache", mustacheExpress());

app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const config = getHardwareInfo();
  res.render("index", {
    URL,
    PORT,
    CPU_MODEL: config.machine.CPU_MODEL,
    TOTAL_RAM: config.machine.TOTAL_RAM,
    FREE_RAM: config.machine.FREE_RAM,
    MINIMUN_CPU: config.machine.MINIMUN_CPU,
    MAXIMUN_CPU: config.machine.MAXIMUN_CPU,
    MINIMUN_RAM: config.machine.MINIMUN_RAM / 2 ** 20,
    MAXIMUN_RAM: config.machine.MAXIMUN_RAM / 2 ** 20,
  });
});

app.get("/options", async (req, res) => {
  const result = await dockerManager.getAvailablesConfigs();
  res.json({ result });
});

app.get("/applications", (req, res) => {
  const result = dockerManager.getApplications();
  res.json({ result });
});

app.post("/up", async (req, res) => {
  const validadated = validation.validateApplication(req.body);

  if (validadated) {
    const result = await dockerManager.runComposer(req.body);
    res.json({
      success: true,
      message: "Container build successfully!",
      result,
    });
  } else {
    res.json({
      success: false,
      message: "Something went wrong, try again!",
      result: null,
    });
  }
});

app.post("/down", async (req, res) => {
  // TO-DO: Validate data
  console.log(req.body);

  const result = await dockerManager.removeComposer(req.body);
  res.json({ result });
});

app.get("/script", async (req, res) => {
  const id = req.query.id;
  const type = req.query.type;
  const method = req.query.method;

  const application = dockerManager.getApplicationById(id);

  if (application) {
    const port = application.port;
    const result = await scriptManager.generateScript(
      `${URL}:${port}`,
      type,
      application,
      method
    );
    res.download(result.value);
  } else {
    res.json({
      success: false,
      message: "Something went wrong, try again!",
      result: null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on PORT (${PORT})`);
});
