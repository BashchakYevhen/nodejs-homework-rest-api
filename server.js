const { app } = require("./app");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();
const { HOST_DB, PORT = 3000 } = process.env;
async function server() {
  try {
    if (!HOST_DB) {
      throw new Error("HOST_DB not set!");
    }
    await mongoose.connect(HOST_DB);
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (error) {
    console.log(error, "disconnect server");
    process.exit(1);
  }
}
server();
