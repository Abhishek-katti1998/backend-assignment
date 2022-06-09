//Start Server

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
//synchronous errors outside express
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // console.log("db connection succesfull :)");
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  //   console.log(`App running on port ${port}...`);
});
//Errors outside express(eg.mongoDB connection error)(async)
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    //1 for unhandled rejection
    //0 for succes
    process.exit(1);
  });
});
