import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as jwt from 'jsonwebtoken';
import * as cors from 'cors';
var cookies = require("cookie-parser");


import { User } from './entity/User';
import { Post } from './entity/Post';

createConnection().then(async () => {
  // create and setup express app
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  app.use(cookies());
  app.use('/', (req: Request, res: Response, next: any) => {
    console.log('cookies', req.cookies);
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
    try {
      if (!await User.findOne({ email: req.body.email })) {
        const user = await User.create(req.body).save();
        const token = jwt.sign(user.id, 'secret');
        res.cookie('token', token, { httpOnly: true, expires: 0 })
        res.status(200).json(user);
      } else {
        res.status(409).send('Email is already in use.');
      }
    } catch (error) {
      res.status(500).send(error.message);
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
        res.cookie('token', token, { httpOnly: true, expires: 0 });
        res.status(200).json(user);
      } else {
        res.status(404).send('Email or password is incorrect.');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.get('/user', async (req: Request, res: Response) => {
    const user = req.user;
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found.');
    }
  });

  app.post('/user', async (req: Request, res: Response) => {
    const { user, body } = req;
    if (user) {
      const updatedUser = await User.create(body).save();
      res.status(200).json(updatedUser);
    } else {
      res.status(404).send('User not found.');
    }
  });

  app.get('/post', async (_req: Request, res: Response) => {
    const postsWithUsers = [];
    const posts: any = await Post.find();
    for (const post of posts) {
      const user = await User.findOne(post.userId);
      post.user = user;
      postsWithUsers.push(post);
    }
    res.status(200).json(postsWithUsers);
  });

  app.get('/post/:id', async (req: Request, res: Response) => {
    const post: any = await Post.findOne(req.params.id);
    const user = await User.findOne(post.userId);
    post.user = user;
    res.status(200).json(post);
  });

  app.post('/post', async (req: Request, res: Response) => {
    const { body } = req;

    const post = await Post.create(body).save();
    res.status(200).json(post);
  });

  // start express server
  console.log('Starting a server');
  app.listen(8000);

}).catch(error => console.log(error));
