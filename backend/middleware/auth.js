import { User } from "../models/user.models.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import HandleErrors from "./handleError.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new HandleErrors("User not Authenicated", 401));
  }



  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedToken.id);

  next();
});
