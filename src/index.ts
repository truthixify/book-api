import express, { Application } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import morgan from "morgan";

import healthCheckRoute from "./routes/health_check";
import bookRoute from "./routes/book";
import authorRoute from "./routes/author";
import categoryRoute from "./routes/category";
import authRoute from "./routes/auth";

const app: Application = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

// Connect to DB
mongoose
  .connect(String(process.env.MONGODB_URI))
  .then(() => console.log("Connected to DB successfully"))
  .catch((err) => console.log("Error connecting to DB: ", err));

// Routes
app.use("/api/health-check", healthCheckRoute);
app.use("/api/auth", authRoute);
app.use("/api/author", authorRoute);
app.use("/api/books", bookRoute);
app.use("/api/category", categoryRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening to server on port: ${PORT}`));

export default app;
