import mongoose, { Model } from 'mongoose';

import clientSchema, { ClientInterface } from './client';
import tokenSchema, { TokenInterface } from './token';
import userSchema, { UserInterface } from './user';
import accountsDB from './db';

export const Client: Model<ClientInterface> = accountsDB.model('Client', clientSchema);
export const Token: Model<TokenInterface> = accountsDB.model('Token', tokenSchema);
export const User: Model<UserInterface> = accountsDB.model('User', userSchema);
