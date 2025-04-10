import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req,res,next)=>{
    try {
        if(!req.cookies?.accessToken){
            throw new ApiError(401, "access token is missing");
        }
        const token = req.cookies.accessToken;
    
        const verifiedJWT = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        if(!verifyJWT){
            throw new ApiError(401,"user not verified");
        }
    
        const user = User.findById(verifiedJWT._id).select("-password -refreshToken");
    
        if(!user) throw new ApiError(401,"invalid token");
    
        req.user=user;
        next();
    } catch (error) {
        throw new ApiError(401,"error in user verifying block")
    }
    
})