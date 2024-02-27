import mongoose from "mongoose";
import { Comment } from "../../types/DBtypes";

const commentModel = new mongoose.Schema<Comment>({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  publicationDate: {
    type: Date,
    required: true,
  },

  post: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "onModel",
    required: true,
  },

  onModel: {
    type: String,
    required: true,
    enum: ["Offer", "Review"],
  },
});

export default mongoose.model<Comment>("Comment", commentModel);
