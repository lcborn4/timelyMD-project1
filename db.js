const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

exports.connect = () => {
  console.log("connecting to db");

  // Connecting to the database
  mongoose
    .connect("mongodb://mongo:27017/mydb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};
