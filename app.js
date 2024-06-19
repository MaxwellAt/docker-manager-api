const express = require("express");
const cors = require("cors");
const mustacheExpress = require("mustache-express");

const path = require("path");
const dockerManager = require("./src/dockerManager");
const scriptManager = require("./src/scriptManager");
const validation = require("./src/validation");

const app = express();
const PORT = 8000;
const URL = `http://localhost`;

app.use(cors());

app.engine("mustache", mustacheExpress());

app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { URL, PORT });
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
  const port = req.query.port;
  const type = req.query.type;

  const result = await scriptManager.generateScript(`${URL}:${port}`, type);
  res.download(result.value);
});

app.listen(PORT, () => {
  console.log(`Listening on PORT (${PORT})`);
});
