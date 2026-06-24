import mongoose from "mongoose";

const databaseName = "vida";
const serverSelectionTimeoutMS = 30000;

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI?.trim();

  if (!mongoUri) {
    console.warn("MONGODB_URI is not set; serving fallback in-memory data.");
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: databaseName,
      tls: true,
      serverSelectionTimeoutMS,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.MongooseServerSelectionError) {
      throw new Error(
        [
          `Could not reach MongoDB Atlas within ${serverSelectionTimeoutMS / 1000}s.`,
          "TCP reachability alone is not enough; Atlas must also allow your current public IP and complete the TLS replica-set handshake.",
          `Driver detail: ${error.message}`,
        ].join(" "),
      );
    }

    throw error;
  }

  console.log(`Connected to MongoDB database "${databaseName}".`);

  return true;
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
