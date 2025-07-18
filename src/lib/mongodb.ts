import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global interface for type safety
declare global {
  var mongoose: MongooseCache | undefined;
}

// Global cache to prevent multiple connections in development
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  console.log('connectToDatabase called');
  if (cached.conn) {
    console.log('Using cached connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new database connection...');
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      console.log('Connected to MongoDB');
      return mongoose;
    });
  }

  try {
    console.log('Awaiting database connection...');
    cached.conn = await cached.promise;
    console.log('Database connection established');
  } catch (e) {
    console.error('Database connection failed:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
