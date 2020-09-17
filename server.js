process.on("uncaughtException", (err) => {
  console.error(err);

  process.exit(1);
});

const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

const mongoose = require("mongoose");
const DB = process.env.DB_LOCAL;

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true  
  })
  .then(() => {
    if (process.env.NODE_ENV === "development") console.log(`DB connected`);
  });

const app = require("./app");

PORT = process.env.PORT || 7000;

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development")
    console.log(`Server up and running ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(err);

  server.close(() => {
    process.exit(1);
  });
});
