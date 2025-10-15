import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI)

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/** 
 * Cached connection for MongoDB.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log("Using existing database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            console.log("Using existing database connection");

      return mongoose;
    });
  }
  cached.conn = await cached.promise;
      console.log("Using existing database connection");

  return cached.conn;
}

export default dbConnect;