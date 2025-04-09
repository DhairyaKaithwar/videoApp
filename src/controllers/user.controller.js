import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import {ApiResponse} from '../utils/apiResponse.js'
import { asyncHandler } from "../utils/asyncHandeler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


//method to create access and referesh tokens
const createAccessAndRefreshTokens = async (userId)=>{
    const user = User.findById(userId);
    const accessToken = await user.generateAccesstoken();
    const refreshToken = await user.generateRefreshtoken();

    user.refreshToken=refreshToken;
    await user.save({validationBeforeSave:false});

    return {accessToken,refreshToken};
} 


//Register User

const registerUser = asyncHandler( async (req,res)=>{
    const {fullName, email, username, password }= req.body
    // console.log(fullName);
    // console.log(email);
    console.log("Body:", req.body);
    
   
    //check if data is not filled
    if ([fullName, username, password, email].some((ele) => !ele || ele.trim() === "")) {
        throw new Error("error in fields");
      }

    //check if user already exist
    const existedUser= await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")  // throw error if user exists
    }

    const avatarLocalFile = req.files?.avatar[0]?.path;
    const coverLocalPath  = req.files?.coverImage[0]?.path;


    // console.log("Files:", req.files.avatar[0].path);
    // console.log(process.env.CLOUDINARY_API_KEY)
    if(!avatarLocalFile) throw new ApiError(400, "Avatar file is required")
    if(!coverLocalPath) throw new ApiError(400, "coverImage file is required")

    const avatar = await uploadOnCloudinary(avatarLocalFile)
    const coverImage = await uploadOnCloudinary(coverLocalPath)


    if(!avatar){
        throw new ApiError(400, "Avatar file is required, the error is of cloudinary")  //check for avatar
    }

    

    //create user
    const user = await User.create({
        fullName,
        avatar:avatar.url || "",
        coverImage:coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password
    })
    

    //Check if user created
    const createdUser = await User.findById(user._id).select("-password -refreshTokens")
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json({createdUser});  //Return created user


    // res.status(201).json({
    //     "name":fullName,
    //     "email": email
    // })



})


//Login User

const loginUser = asyncHandler( async (req,res)=>{
    //get data from req
    //check for fields
    //check for password valid or not
    //create access and refresh tokens
    //send cookies

    const {email, username, password} =req.body();

    //check fields
    if(!(email || username)) throw new ApiError(400,"email or username is required")
    if(!password) throw new ApiError(400,"password is required")

    //find user form database
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user) throw new ApiError(404,"user doesn't exist");

    //Check password
    const isCorrect = await user.isPasswordCorrect(password);
    if(!isCorrect) throw new ApiError(401,"password does not match, try again!!!");

    //Generate access and refresh tokens
    const {accessToken,refreshToken}= await createAccessAndRefreshTokens(user._id);

    const loggedInUser = user.findById(user._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accesstoken",accessToken,options)
    .cookie("refreshtoken",refreshToken,options)
    .json(new ApiResponse(
        200,
        {
            loggedInUser,
            accessToken,
            refreshToken
        },
        "user logged in successfully"
    ))



    

})


export {registerUser,loginUser};