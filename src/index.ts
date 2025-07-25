import express from 'express';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { router } from '@/routes/v1';
import  dotenv from 'dotenv';
dotenv.config();

const app: express.Express = express();
app.use('/api/v1/', router);

const PORT: ServerPort = import.meta.env.PORT || 3000;

const listener: Server = app.listen(PORT, () => {
  if (import.meta.env.MODE === 'development') {
    const { port } = listener.address() as AddressInfo;
    console.log('=============== Routes ===============');
    console.log(`[ http://localhost:${port}/@/v1 ]`);
    console.log(`[ http://localhost:${port}/@/v1/visiter.svg ]`);
    console.log(`[ http://localhost:${port}/@/v1/date.svg ]`);
    console.log(`[ http://localhost:${port}/@/v1/github.svg ]`);
    console.log('======================================');
  }
});


export const viteNodeApp = app;