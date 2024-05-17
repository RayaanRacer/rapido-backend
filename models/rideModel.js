import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "driver",
      require: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    amount: {
      type: Number,
      trim: true,
    },
    currentCity: {
      type: String,
      trim: true,
    },
    currentLocation: {
      type: String,
      trim: true,
    },
    destinationLocation: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Completed",
        "Confirmed",
        "Amount Sent",
        "Amount Approved",
        "Cancelled",
        "Initiated",
        "Payment Done",
      ],
      default: "Pending",
    },
    cancel: {
      type: String,
      enum: ["User", "Driver"],
    },
    startOTP: {
      type: Number,
    },
    endOTP: {
      type: String,
      trim: true,
    },
    amount: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const rideModel = mongoose.model("ride", rideSchema);

export default rideModel;
