import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { handleError } from "../utils/error.handler.js";

const verifyToken = (token) => {
  if (!token) {
    throw { message: "Access token not provided.", status: 400 };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
    throw { message: err.message, status: 400 };
  }

  return decoded;
};

export const authenticate = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const user = verifyToken(accessToken);

    req.user = user;
    next();
  } catch (error) {
    console.error("Error authenticating user: ", error);
    handleError(res, error);
  }
};

export const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      handleError(res, { status: 403, message: "Forbidden: Accesss Denied." });
    }
    next();
  };
};
