import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import express from "express";
import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import mainRouter from "./modules/mainRouter";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";

const app = express();

app.use(cookieParser());
app.use(json());

app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend origin
    credentials: true,
  }),
);

app.use(urlencoded({ extended: true }));

app.use("/api", mainRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
