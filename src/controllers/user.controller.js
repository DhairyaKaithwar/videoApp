import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req,res)=>{
    const {fullName, email, username, password }= req.body
    console.log(fullName);
    console.log(email);

   
    //check if data is not filled
    if([fullName, username, password, email].some((ele)=>ele?.trim==="")){
        throw new Error("error in fields");
        
    }

    //check if user already exist
    const existedUser= User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new Error("User already exists");   // throw error if user exists
    }

    const avatarLocalFile = req.files?.avtar[0]?.path;
    const coverLocalPath  = req.files?.coverImage[0]?.path;
    if(!avatarLocalFile) throw new Error("Avatar not found in local");
    if(!coverLocalPath) throw new Error("Cover image not found in local");

    const avatar = await uploadOnCloudinary(avatarLocalFile)
    const coverImage = await uploadOnCloudinary(coverLocalPath)

    if(!avatar){
        throw new Error("avatar not found");  //check for avatar
    }

    //create user
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        username: username.toLowerCase()
    })
    

    //Check if user created
    const createdUser = await User.findById(user._id).select("-password -refreshTokens")
    if(!createdUser){
        throw new Error("User not created");
    }

    return res.status(201).json({createdUser});  //Return created user


    res.status(201).json({
        "name":fullName,
        "email": email
    })



})

export {registerUser};