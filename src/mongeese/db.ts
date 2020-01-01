import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const accountsDB = mongoose.createConnection(`${process.env.MONGO_URL}/${process.env.ACCOUNTS_DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
});

accountsDB.once('open', () => {
    console.log('Connected to Mongo Sucesfully!');
});

export default accountsDB;
