const path = require("path");
const express = require("express");
const dockerManager = require("./src/dockerManager");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));

app.get("/options", async (req, res) => {
  const result = dockerManager.getAvailablesConfigs();
  console.log(result);
  res.json({ result });
});

app.get("/applications", (req, res) => {
  const result = dockerManager.getApplications();
  res.json({ result });
});

app.post("/up", async (req, res) => {
  const result = await dockerManager.runComposer(req.body);
  res.json({ success: true, message: "Container build successfully!", result });
});

app.post("/down", async (req, res) => {
  const result = dockerManager.removeComposer(req.body);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Listening on PORT (${PORT})`);
});
