const cors = require("cors");
const server = require("express");
const bodyParser = require("body-parser");
const app = server();
const PORT = 3000;

const db = require("./queries.js");
const { sequelize } = require("./models");

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({
    info: "Basic users API",
    paths: ["/users", "/users/:id"],
  });
});

app.get("/users", db.getAll);
app.get("/users/:id", db.getById);
app.delete("/users/:id", db.deleteById);
app.post("/users", db.create);

app.listen(PORT, async () => {
  let isConnected = false;
  const delay = 5000;
  console.log(`Listening on port ${PORT}`);

  while (!isConnected) {
    try {
      await sequelize.sync({ force: true });
      isConnected = true;
      console.log("Sequelize synced");
    } catch (err) {
      console.log("Error trying to sync\nTrying to connect ...");
      await new Promise((r) => setTimeout(r, delay));
    }
  }
});
