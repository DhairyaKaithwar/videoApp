import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import connectDB from './db/index.js';

console.log(process.env.PORT?"yes":"no")


connectDB();


/*
(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error",(err)=>{
            console.log("err",err);
            throw err;
        })
    } catch (e) {
        console.error("Error",e);
        throw e;
    }
})()
*/