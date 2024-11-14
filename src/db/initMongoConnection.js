import mongoose from 'mongoose';

const MONGODB_URI =
  'mongodb+srv://fuschteyy:lllkkkjjjhhh1978@cluster0.uacgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export const initMongoConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log('Error while setting up mongo connection');
    throw error;
  }
};
