import { connectMongo } from '../models/connect';

import User from '../models/user.model';

require('dotenv').config();

const regNoArray = ['19BBS0079', '19BBS0127', '19BBS0152', '19BBS0153', '19BCB0012', '19BCE0388', '19BCE0927', '19BCE0940', '19BCE2128', '19BCE2157', '19BCE2221', '19BCE2506', '19BCT0016', '19BCT0071', '19BCT0085', '19BCT0208', '19BCT0215', '19BEC0686', '19BIT0047', '19BIT0093', '19BIT0111', '19BIT0367', '19BIT0386', '19BCE2193', '19BCE2022', '19BBS0019', '19BDS0041', '19BCE0435'];

async function abc() {
    await connectMongo();
    const docs = await User.find({ regNo: { $in: regNoArray } });
    await Promise.all(docs.map((doc) => {
        doc.scope.push('csi');
        console.log(doc.regNo);
        return doc.save();
    }));
}

abc();
