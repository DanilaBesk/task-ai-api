import cookieParser from "cookie-parser";
import express, { Application } from "express";
import { CONFIG } from "#config";
import { router } from "#/routes";
import { ErrorMiddleware, RouteNotFoundMiddleware } from "#/middlewares";
import { prisma } from "#/providers";

export const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.all("*", RouteNotFoundMiddleware);

app.use(ErrorMiddleware);

const start = async () => {
  try {
    await prisma.$connect();
    app.listen(CONFIG.APP_PORT, "localhost", () => {
      console.info(`Server start on PORT: ${CONFIG.APP_PORT}`);
    });
  } catch (error) {
    console.error("Server start with error: ", error);
  }
};

start();
