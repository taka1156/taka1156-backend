import express from 'express';
import { router } from '@/routes/v1';
import { SETTING } from './constants/constant';

const app: express.Express = express();
app.use('/api/v1/', router);

const PORT: ServerPort = SETTING.PORT

app.listen(PORT, () => {
  console.info('Server Start')
});


export const viteNodeApp = app;
export default app;