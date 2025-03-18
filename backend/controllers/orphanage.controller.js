import mongoose from "mongoose";
import Orphanage from "../models/Orphanage.model.js";
import { handleError } from "../utils/error.handler.js";
import { handleResponse } from "../utils/response.handler.js";

export const getOrphanages = async (req, res) => {
  try {
    const orphanages = await Orphanage.find().lean();

    handleResponse(res, 200, "Orphanages retrieved successfully!", {
      orphanages,
    });
  } catch (error) {
    console.log("Error fetching orphanages: ", error);
    handleError(res, error);
  }
};

export const getOrphanage = async (req, res) => {
  try {
    const orphanageId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(orphanageId))
      throw { status: 400, message: "Orphanage ID is required." };

    const orphanage = await Orphanage.findById(orphanageId).lean();
    if (!orphanage) throw { status: 404, message: "Orphanage doesn't exist." };

    handleResponse(res, 200, "Orphanage retrieved successfully!", {
      orphanage,
    });
  } catch (error) {
    console.log("Error fetching orphanage: ", error);
    handleError(res, error);
  }
};

export const createOrphanage = async (req, res) => {
  try {
    const orphanageData = req.body;

    const orphanage = new Orphanage(orphanageData);
    await orphanage.save();

    handleResponse(res, 201, "Orphanage created successfully!", {
      orphanage,
    });
  } catch (error) {
    console.log("Error creating new orphanage: ", error);
    handleError(res, error);
  }
};

export const updateOrphanage = async (req, res) => {
  try {
    const orphanageId = req.params.id;
    const orphanageData = req.body;
    if (!mongoose.Types.ObjectId.isValid(orphanageId))
      throw { status: 400, message: "Orphanage ID is required." };

    const orphanage = await Orphanage.findByIdAndUpdate(
      orphanageId,
      orphanageData,
      {
        new: true,
      }
    ).lean();
    if (!orphanage) throw { status: 404, message: "Orphanage doesn't exist." };

    handleResponse(res, 200, "Orphanage updated successfully!", {
      orphanage,
    });
  } catch (error) {
    console.log("Error updating orphanage: ", error);
    handleError(res, error);
  }
};

export const deleteOrphanage = async (req, res) => {
  try {
    const orphanageId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(orphanageId))
      throw { status: 400, message: "Orphanage ID is required." };

    const orphanage = await Orphanage.findById(orphanageId);
    if (!orphanage) {
      throw { status: 404, message: "Orphanage doesn't exist." };
    }

    const deletedOrphanage = orphanage.toObject();
    await orphanage.deleteOne();

    handleResponse(res, 200, "Orphanage deleted successfully!", {
      deletedOrphanage,
    });
  } catch (error) {
    console.log("Error deleting orphanage: ", error);
    handleError(res, error);
  }
};
