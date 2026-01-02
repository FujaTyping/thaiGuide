import { createClient } from 'redis';

const clientRD = createClient();

clientRD.on('error', err => console.log('[REDIS] Client Error', err));

await clientRD.connect();

export default clientRD;