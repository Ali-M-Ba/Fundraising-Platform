import mongoose from "mongoose";
import Orphan from "../models/Orphan.model.js";
import { handleError } from "../utils/error.handler.js";
import { handleResponse } from "../utils/response.handler.js";

export const getOrphans = async (req, res) => {
  try {
    const orphans = await Orphan.find().lean();

    handleResponse(res, 200, "Orphans retrieved successfully!", {
      orphans,
    });
  } catch (error) {
    console.log("Error fetching orphans: ", error);
    handleError(res, error);
  }
};

export const getOrphan = async (req, res) => {
  try {
    const orphanId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(orphanId))
      throw { status: 400, message: "Orphan ID is required." };

    const orphan = await Orphan.findById(orphanId).lean();
    if (!orphan) throw { status: 404, message: "Orphan doesn't exist." };

    handleResponse(res, 200, "Orphan retrieved successfully!", {
      orphan,
    });
  } catch (error) {
    console.log("Error fetching orphan: ", error);
    handleError(res, error);
  }
};

export const createOrphan = async (req, res) => {
  try {
    const orphanData = req.body;

    const orphan = new Orphan(orphanData);
    await orphan.save();

    handleResponse(res, 201, "Orphan created successfully!", {
      orphan,
    });
  } catch (error) {
    console.log("Error creating new orphan: ", error);
    handleError(res, error);
  }
};

export const updateOrphan = async (req, res) => {
  try {
    const orphanId = req.params.id;
    const orphanData = req.body;
    if (!mongoose.Types.ObjectId.isValid(orphanId))
      throw { status: 400, message: "Orphan ID is required." };

    const orphan = await Orphan.findByIdAndUpdate(orphanId, orphanData, {
      new: true,
    }).lean();
    if (!orphan) throw { status: 404, message: "Orphan doesn't exist." };

    handleResponse(res, 200, "Orphans updated successfully!", {
      orphan,
    });
  } catch (error) {
    console.log("Error updating orphan: ", error);
    handleError(res, error);
  }
};

export const deleteOrphan = async (req, res) => {
  try {
    const orphanId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(orphanId))
      throw { status: 400, message: "Orphan ID is required." };

    const orphan = await Orphan.findById(orphanId);
    if (!orphan) {
      throw { status: 404, message: "Orphan doesn't exist." };
    }

    const deletedOrphan = orphan.toObject();
    await orphan.deleteOne();

    handleResponse(res, 200, "Orphan deleted successfully!", {
      deletedOrphan,
    });
  } catch (error) {
    console.log("Error deleting orphan: ", error);
    handleError(res, error);
  }
};
