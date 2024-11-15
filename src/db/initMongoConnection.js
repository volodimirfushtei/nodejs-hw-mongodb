import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { env } from '../env.js';

dotenv.config();
export const initMongoConnection = async () => {
  try {
    const MONGODB_USER = env('MONGODB_USER');
    const MONGODB_PASSWORD = env('MONGODB_PASSWORD');
    const MONGODB_URI = env('MONGODB_URI');
    const MONGODB_DB = env('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URI}/${MONGODB_DB}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error during MongoDB connection:', error.message || error);
    throw error;
  }
};
