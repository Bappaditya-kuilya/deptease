require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectToMongo = async () => {
  if (!mongoURI) {
    throw new Error("MONGODB_URI is not set");
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoURI, { useNewUrlParser: true })
      .then((m) => m.connection);
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectToMongo;
