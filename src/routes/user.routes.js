import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import {upload} from '../middlewares/multer.middleware.js'
import  {verifyJWT}  from "../middlewares/auth.middleware.js";



const router = Router();


//register user
router.route('/register').post(
    upload.fields([{
        name:'avatar',
        maxCount:1
    },{
        name:'coverImage',
        maxCount:1
    }])
    ,
    registerUser);

//login user
router.route('/login').post(loginUser);

//protected route
router.route('/logout').post(verifyJWT, logoutUser)




export default router;

