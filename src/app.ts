import cors from "cors";
import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swaggerConfig";
import { errorHandler, routeNotFound } from "./middleware";
import { authRoute, jobApplicationRoute, userProfileRoute  } from "./routes";

const app: Express = express();
app.options("*", cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
  }),
);


// app.use(Limiter);
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "I am the express API responding for Job Listing Platform",
  });
});
app.get("/api/v1", (req: Request, res: Response) => {
  res.json({ message: "I am the express API responding for Job Listing Platform" });
});

app.use("/api/v1", authRoute);
app.use("/api/v1", jobApplicationRoute);
app.use("/api/v1", userProfileRoute);

app.use(errorHandler);
app.use(routeNotFound);

export default app;
