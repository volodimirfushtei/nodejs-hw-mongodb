import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export const initMongoConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log('Error while setting up mongo connection');
    throw error;
  }
};
