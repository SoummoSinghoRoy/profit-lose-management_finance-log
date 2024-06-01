import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

const middlewares: express.RequestHandler[] = [
  morgan('dev'),
  express.urlencoded({extended: true}),
  express.json(),
  cors()
]

export default (app: Application): void => {
  middlewares.forEach((middleware: express.RequestHandler) => {
    app.use(middleware)
  })
}