import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);

const mongodbURI = `mongodb+srv://${username}:${password}@musiko-backend.cqffs.mongodb.net/?retryWrites=true&w=majority&appName=musiko-backend`;

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(mongodbURI, {
      dbName: "musiko-backend",
    });

    connect.connection.on("connected", () => {
      console.log("db connected");
    });
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
