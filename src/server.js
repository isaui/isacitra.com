import express from 'express';
import mongoose from 'mongoose';
import {User} from '../models/User.js';
import cors from 'cors';
import BlogPost from '../models/Post.js';
import Comment from '../models/Comment.js';
import asyncWrapper from '../utils/async-wrapper.js';
import Subscription from '../models/Susbscription.js';

import ArticleRoute from '../route/article.js';
import AuthenticationRoute from '../route/authentication.js';
import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bodyParser from 'body-parser';



const url = "mongodb://localhost:27017/isacitraweb"
const atlasUrl = "mongodb+srv://isacitra:ENLkYSN2evCAab5D@isacitraweb.batvch9.mongodb.net/?retryWrites=true&w=majority";

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect('mongodb+srv://isacitra:HcUUg1NBxFuiBw8Y@isacitraweb.batvch9.mongodb.net/?retryWrites=true&w=majority')
const db = mongoose.connection;
db.on("error",console.error.bind(console, "database connection error"))
db.once("open", ()=>{
    console.log('Mongo database connected')
} )
const app = express();
const PORT = 3001;
const corsOptions = {
    origin:'https://isacitra-com.vercel.app/'
}
const sessionConfig = {
  secret: 'sipalingambisius',
  resave:false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
  
}

const resetAll = async () => {
  await User.deleteMany({})
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


app.use('/authentication', AuthenticationRoute);
app.use('/articles', ArticleRoute);




app.get('/fakeUser', asyncWrapper(async(req,res)=>{
  const fakeUser = {
    username: 'BambangGaming',
    email: 'bambang@example.com',
    profile: {
      firstName: 'Bambang',
      lastName: 'Satrio',
      bio: 'Seorang profesional dalam teknologi.',
      avatar: '',
    },
    role: {
      name: 'user'
    }
  };
  const userCreated = new User(fakeUser);
  const newUser = await User.register(userCreated, 'chicken')
  res.send(newUser)
}))




app.get('/', asyncWrapper(async (req,res)=> {
  const topPicks = await BlogPost.aggregate([
    { $sample: { size: 3 } },
  ]);
    res.send({topPicks})
}))

app.listen(PORT, () => {
    console.log('backend berjalan di port 3000')
})