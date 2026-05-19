import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected Successfully");
  } catch (err) {
    console.log("Database Connection Failed");
    console.error(err);
  }
};

export default connectDB;