import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },
    driver: {
      type: mongoose.Schema.ObjectId,
      ref: "driver",
      required: true,
    },
    messages: {
      sender: {
        type: String,
        enum: ["driver", "user"],
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const conversationModel = mongoose.model("conversation", conversationSchema);
export default conversationModel;
