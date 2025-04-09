import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import connectDB from "./db/db.index.js";
import { app } from "./app.js";
import express from "express";

console.log(process.env.MONGODB_URI ? "URI available" : "URI not available");


const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(port || 8000, () => {
      console.log(`app is listening on port ${port || 8000}`);
    });
  })
  .catch((err) => {
    console.error("error while connecting to database", err);
  });



// (async ()=>{
//     try {
//         const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         console.log("MongoDB connected:", connectionInstance.connection.host);
//         app.on("error",(err)=>{
//             console.log("err",err);
//             throw err;
//         })
//     } catch (e) {
//         console.error("Error while connecting to mongodb",e);
//         throw e;
//     }
// })()
