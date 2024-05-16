import mongoose from "mongoose";

const driver = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    phone: {
      type: Number,
      required: [true, "phone is required"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    currentLocation: {
      type: String,
      required: [true, "experience is required"],
    },
    active: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Password is neccessary"],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const driverModel = mongoose.model("driver", driver);
export default driverModel;
