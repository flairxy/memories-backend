import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from "dotenv";

import postRoutes from "./routes/posts.js";

const PORT = process.env.PORT || 5000;
const app = express();
dotenv.config();


app.use(express.json({
  limit: '30mb',
  extended: true
}));
app.unsubscribe(express.urlencoded({
  limit: '30mb',
  extended: true
}))
app.use(cors());

app.use('/posts', postRoutes);

const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
})).catch(error => console.log(error.message));

mongoose.set('useFindAndModify', false);
