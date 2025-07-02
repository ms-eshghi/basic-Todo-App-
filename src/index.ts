import mongoose from "mongoose";
import { app } from "../app";

const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/testdb")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
