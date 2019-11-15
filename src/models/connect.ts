import mongoose from 'mongoose';
import User from './user.model';

mongoose.Promise = global.Promise;

export async function connectMongo() {
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
    });
    console.log('Connected to Mongo Sucesfully!');
}

export default connectMongo;
