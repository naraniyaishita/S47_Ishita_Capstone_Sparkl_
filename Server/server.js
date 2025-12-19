import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from 'jsonwebtoken'

import UserRoute from './Routes/User.js'
import BookRoute from './Routes/Books.js'
import BlogRoute from './Routes/Blog.js'
import WatchListRoute from './Routes/Watchlist.js'

import session from "express-session";
import passport from "passport";
import GoogleModal from "./Schemas/googleUser.schema.js";
import { Strategy as OAuth2Strategy } from "passport-google-oauth2";


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.send("Welcome to the Sparkl Server!");
});

mongoose
  .connect(process.env.MONGOOSE_CONNECTION, { dbName: "Sparkl" })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

  app.use(
    session({
      secret: process.env.CLIENT_SECRET_GOOGLE,
      resave: false,
      saveUninitialized: true,
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(
    new OAuth2Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
        scope: ["email", "profile"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await GoogleModal.findOne({ googleId: profile.id });
  
          if (!user) {
            user = new GoogleModal({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              image: profile.photos[0].value,
            });
  
            await user.save();
          }
  
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login` }),
    (req, res) => {
      const token = jwt.sign({ userId: req.user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  
      res.redirect(`${process.env.CLIENT_URL}/google-success?token=${token}&userId=${req.user._id}&username=${req.user.name}&email=${req.user.email}`);
    }
  );
  
  

  app.use('/user',UserRoute)
  app.use('/blog', BlogRoute)
  app.use('/books', BookRoute)
  app.use('/watchList', WatchListRoute)

app.listen(2004, () => {
  console.log("🚀 Server is running");
});
