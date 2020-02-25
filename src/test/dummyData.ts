import crypto from 'crypto';

import { Client, User } from '../models/models';


export const createDummyData = async () => {
    const client1 = new Client({
        clientName: 'ccs-app',
        clientId: crypto.randomBytes(64).toString('hex'),
        redirectUris: ['http://localhost:3000/oauth/token'],
    });
    const user1 = new User({
        name: 'Rishit Bansal',
        username: 'thebongy',
        email: 'test@gmail.com',
        mobile: 9999999999,
        password: 'test123',
        regNo: '18BCE0000',
        gender: 'M',
        scope: ['user'],
    });

    await Promise.all([
        client1.save(),
        user1.save(),
    ]);
    console.log('Dummy data created');
};

export default createDummyData;
