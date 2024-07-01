import app from "./app.js";

import { config } from "dotenv";
import connectDatabase from "./config/database.js";



process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server is shutting down due to uncaught exception`);

  process.exit(1);
});

// Config
config({ path: "backend/config/config.env" });
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is runnning on port : ${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server is shutting down due to unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
