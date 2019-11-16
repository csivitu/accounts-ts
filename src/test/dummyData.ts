import crypto from 'crypto';

import Client from '../models/client.model';
import User from '../models/user.model';

export const createDummyData = async () => {
    const client1 = new Client({
        clientName: 'ccs-app',
        clientId: crypto.randomBytes(64).toString('hex'),
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
        client1,
        user1,
    ]);
};

export default createDummyData;
