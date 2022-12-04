const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contactsRouter");
const authRouter = require("./routes/api/authRouter");
const userRouter = require("./routes/api/userRouter");
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/public", express.static("public"));
app.use("/api/users", authRouter);
app.use("/api/users", userRouter);
app.use("/api/contacts", contactsRouter);

app.use("/", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      message: "Not authorized",
    });
  }
  console.log("START_ERR___", err.name, "___END_ERR");
  res.status(500).json({ message: err.message });
});

module.exports = { app };
