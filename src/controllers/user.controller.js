import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

export {registerUser};