import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.ObjectId,
      ref: "driver",
      required: true,
    },
    ride: {
      type: mongoose.Schema.ObjectId,
      ref: "ride",
    },
    message: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const notificationModel = mongoose.model("notifications", notificationSchema);
export default notificationModel;
