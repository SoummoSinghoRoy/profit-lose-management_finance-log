import express, { Application } from 'express';
import mongoose from 'mongoose';
const app: Application = express();

import customEnvironmentvar from './config/custom_env_variables';
import setMiddlewares from './middlewares/middleware';
setMiddlewares(app);
import setRoute from './api/routes/route';
setRoute(app);

const PORT: string | number = process.env.PORT || 7272;

mongoose.set('strictQuery', false);
mongoose.connect(customEnvironmentvar.db_uri).then((): void => {
  console.log(`DB connected....`);
  app.listen(PORT, (): void => {
    console.log(`Server connected on port ${PORT}`);
  })
}).catch((err): void => {
  console.log(err);
})