import mongoose from 'mongoose';
// import createDummyData from '../test/dummyData';

mongoose.Promise = global.Promise;

const accountsDB = mongoose.createConnection(
    `${process.env.MONGO_URL}/${process.env.ACCOUNTS_DB}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
    },
);

accountsDB.once('open', async () => {
    console.log('Connected to Mongo Sucesfully!');
    // await createDummyData();
});

export default accountsDB;
