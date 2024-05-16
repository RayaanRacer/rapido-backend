import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDb from "./config/configDB.js";
import rideRoutes from "./routes/rideRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
// dot env
dotenv.config();
const PORT = process.env.PORT;
const MongoDBURI = process.env.MONGO_URI;
connectDb(MongoDBURI);

app.use(morgan("dev"));

app.use("/ride/api/v1", rideRoutes);
app.use("/user/api/v1", userRoutes);
app.use("/driver/api/v1", driverRoutes);
app.listen(
  PORT,
  console.log(`Server running in mode on port http://localhost:${PORT}`)
);
