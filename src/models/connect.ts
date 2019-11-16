import mongoose from 'mongoose';
import User from './user.model';
import createDummyData from '../test/dummyData';

mongoose.Promise = global.Promise;

export async function connectMongo() {
    await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`, {
        useNewUrlParser: true,
        useCreateIndex: true,
    });
    console.log('Connected to Mongo Sucesfully!');
}

export default connectMongo;
