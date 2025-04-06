import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asyncHandeler.js";

const router = Router();

router.post('/register', asyncHandler(registerUser));


export default router;

