import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongoClientCache {
  conn: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

declare global {
  var mongoClient: MongoClientCache | undefined;
}

const cached: MongoClientCache = global.mongoClient || { conn: null, promise: null };

if (!global.mongoClient) {
  global.mongoClient = cached;
}

async function createMongoClient(): Promise<MongoClient> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const client = new MongoClient(MONGODB_URI);
    cached.promise = client.connect();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function getMongoClient() {
  const client = await createMongoClient();
  const db = client.db('rightrack');
  return { client, db };
}

export default createMongoClient;
