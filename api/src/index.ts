import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as jwt from 'jsonwebtoken';
import * as cors from 'cors';

import { User } from './entity/User';

createConnection().then(async () => {
  // create and setup express app
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  app.use('/', (req: Request, res: Response, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, 'secret', async (_err: any, userId: any) => {
        req.user = await User.findOne(userId);
        next();
      });
    }
    next();
  });

  // register routes
  app.post('/register', async (req: Request, res: Response) => {
    // here we will have logic to return all users
    const { email, password, name } = req.body;
    try {
      if (!await User.findOne({ email })) {
        const user = await User.create({ email, password, name }).save();
        const token = jwt.sign(user.id, 'secret');
        res.cookie('token', token, { httpOnly: true, expires: 0 })
        res.status(200).json(user);
      } else {
        res.status(409).send('Email is already in use.');
      }
    } catch (error) {
      res.error(error);
    }
  });

  app.post('/login', async (req: Request, res: Response) => {
    // here we will have logic to return user by id
    try {
      console.log(req.body);
      const { email, password } = req.body;

      const user = await User.findOne({ email, password });
      if (user) {
        console.log(user);
        const token = jwt.sign(user.id, 'secret');
        res.status(200).json(user).cookie('token', token, { httpOnly: true, expires: 0 });
      } else {
        res.status(400).send('User not found.');
      }
    } catch (error) {
      res.error(error);
    }
  });

  // start express server
  console.log('Starting a server');
  app.listen(8000);

}).catch(error => console.log(error));
