
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/captchaDB";

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
  
    return mongoose.connection.asPromise();
  }

  return mongoose.connect(MONGODB_URI);
}

export default connectDB;
