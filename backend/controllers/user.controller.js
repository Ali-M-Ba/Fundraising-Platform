import mongoose from "mongoose";
import User from "../models/User.model.js";
import { handleError } from "../utils/error.handler.js";
import { handleResponse } from "../utils/response.handler.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    handleResponse(res, 200, "Users retrieved successfully!", { users });
  } catch (error) {
    console.error("Error fetching users: ", error);
    handleError(res, error);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    handleResponse(res, 200, "User retrieved successfully!", { user });
  } catch (error) {
    console.error("Error fetching user: ", error);
    handleError(res, error);
  }
};

export const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await User.create(userData);
    const userObj = user.toObject();
    delete userObj.password;
    handleResponse(res, 201, "User created successfully!", { user: userObj });
  } catch (error) {
    console.error("Error creating user: ", error);
    handleError(res, error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userData = req.body;
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw { status: 400, message: "User ID is required." };

    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    }).select("-password");
    handleResponse(res, 200, "User updated successfully!", { updatedUser });
  } catch (error) {
    console.error("Error updating user: ", error);
    handleError(res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw { status: 400, message: "User ID is required." };

    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw { status: 404, message: "User not found." };
    }

    const adminRole = req.user.role;

    // Only the Admin can delete users, whether "donor", or "orphanage"
    // Admin cannot delete itself
    if (adminRole !== "admin" || user.role === "admin") {
      throw {
        status: 401,
        message: `${adminRole} cannot delete ${user.role}.`,
      };
    }

    const deletedUser = user.toObject(); // Store user info before deletion
    await user.deleteOne();

    handleResponse(res, 200, "User deleted successfully!", deletedUser);
  } catch (error) {
    console.error("Error deleting user: ", error);
    handleError(res, error);
  }
};
