const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const port = 3000;

const rolesRouter = require("./routes/roles");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const db = require("./db").connect();

const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/users", usersRouter);
app.use("/roles", rolesRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
