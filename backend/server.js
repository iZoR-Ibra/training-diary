import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import workoutRoutes from "./routes/workoutRoutes.js";

const app = express(); 

app.use(express.json());
app.use("/api/workouts", workoutRoutes)

dotenv.config({ path: "./backend/.env" });
console.log("MONGO_URI:", process.env.MONGO_URI);

app.use(cors());

import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));
