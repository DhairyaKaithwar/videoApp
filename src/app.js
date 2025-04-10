import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());


//import user router
import userRouter from './routes/user.routes.js'

//routes declaration
app.use('/api/v1/users',userRouter)

export { app };
