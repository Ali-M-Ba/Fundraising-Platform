import User from "../models/User.model.js";
import RefreshToken from "../models/RefreshToken.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { handleResponse } from "../utils/response.handler.js";
import { handleError } from "../utils/error.handler.js";
import { generateTokens, setCookies } from "../utils/token.utils.js";

export const processSignup = async (req, res) => {
  try {
    const credentials = req.body;
    const newUser = new User(credentials);
    const savedUser = await newUser.save();

    const { accessToken, refreshToken } = generateTokens(
      savedUser._id,
      savedUser.role
    );

    const newToken = new RefreshToken({
      userId: savedUser._id,
      refreshToken,
      expiresAt: new Date(
        Date.now() + parseInt(process.env.REFRESH_TOKEN_MAX_AGE, 10)
      ),
    });

    const { refreshToken: hashedRefreshToken } = await newToken.save();

    setCookies(res, accessToken, hashedRefreshToken);

    handleResponse(res, 201, "User signed up successfully!", {
      userId: savedUser._id,
      role: savedUser.role,
      accessToken,
      refreshToken: hashedRefreshToken,
    });
  } catch (error) {
    console.log("Error accurred while signing up a new user: ", error);
    handleError(res, error);
  }
};

export const processLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid email or password");
      error.status = 401; // Unauthorized
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.status = 401; // Unauthorized
      throw error;
    }

    const userId = user._id;

    const exitstingToken = await RefreshToken.findOne({ userId });
    let refreshToken;

    // Check if the user already has a valid, non-expired refresh token
    if (exitstingToken && !exitstingToken.isExpired()) {
      // If a valid token exists, reuse it by assigning it to refreshToken
      refreshToken = exitstingToken.refreshToken;
    } else {
      // If no valid token exists (either missing or expired), generate a new refresh token
      const { refreshToken: newRefreshToken } = generateTokens(
        userId,
        user.role
      );

      // Remove all existing refresh tokens associated with the user
      await RefreshToken.deleteMany({ userId });

      const newToken = new RefreshToken({
        userId,
        refreshToken: newRefreshToken,
        expiresAt: new Date(
          Date.now() + parseInt(process.env.REFRESH_TOKEN_MAX_AGE, 10)
        ),
      });

      const { refreshToken: hashedRefreshToken } = await newToken.save();
      // Assign the new hashed refresh token to the refreshToken variable
      refreshToken = hashedRefreshToken;
    }

    const { accessToken } = generateTokens(userId, user.role);

    setCookies(res, accessToken, refreshToken);

    handleResponse(res, 200, "User logged in successfully!", {
      userId,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("Error acurred while logging in the user: ", error);
    handleError(res, error);
  }
};

export const processLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      const error = new Error("Refresh token not found");
      error.status = 404;
      throw error;
    }

    await RefreshToken.deleteOne({ refreshToken });

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    handleResponse(res, 200, "Logged out successfully!");
  } catch (error) {
    console.log("Error accurred while logging out the user: ", error);
    handleError(res, error);
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  // console.log("the refresh token that stored in the cookies: ", refreshToken);
  try {
    if (!refreshToken) {
      const error = new Error("Refresh token not found");
      error.status = 404; // Not found
      throw error;
    }

    const { userId, role } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const storedToken = await RefreshToken.findOne({ userId });
    if (!storedToken || !(await storedToken.verifyToken(refreshToken))) {
      const error = new Error("Invalid refresh token");
      error.status = 401; // Unauthorized
      throw error;
    }

    const { accessToken } = generateTokens(userId, role);

    setCookies(res, refreshToken, accessToken);

    handleResponse(res, 201, "Access token refreshed successfully!", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("Error accurred while refreshing the access token: ", error);
  }
};
