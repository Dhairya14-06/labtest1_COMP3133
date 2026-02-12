const mongoose = require("mongoose");

async function connectDB(uri) {
  if (!uri) {
    throw new Error("MONGO_URI is missing. Check your .env file.");
  }

  await mongoose.connect(uri);
  console.log("✅ MongoDB Atlas connected!");
}

module.exports = connectDB;
