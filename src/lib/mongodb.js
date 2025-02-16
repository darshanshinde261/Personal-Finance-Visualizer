// src/lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error('Missing MongoDB URI');

let cached = global.mongoose || { conn: null, promise: null };

export const connectDB = async () => {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { 
      dbName: 'finance',
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
};