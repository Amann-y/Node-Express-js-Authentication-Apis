import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoutes from "./routes/testRoutes.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

// dotenv config
dotenv.config();

//database connection
connectDB(process.env.MONGO_URL);

const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes
app.use("/api/v1", testRoutes);
app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hey");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});
