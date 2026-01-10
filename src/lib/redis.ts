import { createClient } from 'redis';

const clientRD = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

clientRD.on('error', err => console.log('[REDIS] Client Error', err));

await clientRD.connect();
console.log('[REDIS] Client connected')

export default clientRD;