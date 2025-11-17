import ImageKit from '@imagekit/nodejs';
import 'dotenv/config';

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT
});

export default client;