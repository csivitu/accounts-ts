import mongoose from 'mongoose';

import { connectMongo } from '../models/connect';
import { User } from '../models/user.model';
import { Token } from '../models/token.model';
import { Client } from '../models/client.model';

const main = async () => {
    await connectMongo();

};
