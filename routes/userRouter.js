import express from "express";

import {
  createUser,
  googleLogin,
  getUsers,
  loginUser,
  sendOTP,
  validateOTPAndUpdatePassword,
  getAllUsers,
  updateUserStatus,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/", getUsers);
userRouter.get("/all", getAllUsers);
userRouter.put("/toggle-block/:email", updateUserStatus);
userRouter.post("/google-login", googleLogin);
userRouter.get("/send-otp/:email", sendOTP);
userRouter.post("/validate-otp", validateOTPAndUpdatePassword);

export default userRouter;
