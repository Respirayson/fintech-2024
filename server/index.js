import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from './mongodb/connect.js';
import mountRoutes from "./routes/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mountRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello World! Checking whether it works or not");
});

export const startServer = async () => {
  try {

    connectDB(process.env.ATLAS_URL);

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
