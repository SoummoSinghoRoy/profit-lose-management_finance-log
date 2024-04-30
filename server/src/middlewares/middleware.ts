import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const middlewares: express.RequestHandler[] = [
  morgan('dev'),
  express.urlencoded({extended: true}),
  express.json(),
  cors(),
  cookieParser()
]

export default (app: Application): void => {
  middlewares.forEach((middleware: express.RequestHandler) => {
    app.use(middleware)
  })
}