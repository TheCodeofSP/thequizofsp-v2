import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  if (!cached.promise) {
    mongoose.set("bufferCommands", false);

    cached.promise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
      dbName: process.env.MONGO_DB_NAME || "thequizofsp",
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Une promesse rejetée ne doit pas rester en cache sur une fonction Vercel :
    // la requête suivante pourra retenter la connexion à MongoDB.
    cached.promise = null;
    throw error;
  }
}

export function getDatabaseState() {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] || "unknown";
}
