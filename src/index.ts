import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app";
import config from "./config";
import log from "./utils/logger";
import { initializeMongoDataSource } from "./data-source";

dotenv.config();

const port = config.port;

// Initialize MongoDB Data Source and Start Server
initializeMongoDataSource()
  .then(() => {
    app.listen(port, () => {
      log.info(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => {
    log.error("Error initializing MongoDB connection:", error);
    process.exit(1); // Exit the process if MongoDB connection fails
  });
