import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const userRegistration = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password)
    return res.status(400).json({
      message: "Please provide complete information.",
      success: false,
    });

  if (phone.length !== 10)
    return res.status(400).json({
      message: "Phone number should be of 10 numbers",
      success: false,
    });
  const registeredUser = await userModel.findOne({
    $or: [{ email: email }, { phone: phone }],
  });
  if (registeredUser) {
    return res.status(400).json({
      message: `User is already registered with email ${email}`,
      success: false,
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new userModel({
    name,
    email,
    phone,
    password: hashedPassword,
  });
  const result = await user.save();
  if (result) {
    return res.status(200).json({
      message: `User is registered successfully.`,
      data: result,
      success: true,
    });
  }
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Provide complete data", success: false });
  }
  const user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ message: "user not found.", success: false });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ message: "Invalid Email and password", success: false });
  }
  await userModel.findByIdAndUpdate(user._id, { active: true }, { new: true });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return res.status(200).json({
    message: "Login Success",
    success: true,
    token,
    name: user.name,
    id: user._id,
    email: email,
    phone: user.phone,
  });
});

const userAuthController = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.body.userID);
  if (!user) {
    return res.status(404).json({
      message: "User not found.",
      success: false,
    });
  } else {
    return res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        id: user.id,
      },
    });
  }
});

const userProfileUpdateController = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId)
    return res
      .status(400)
      .json({ message: "Provide complete data", success: false });
  let { name, email, phone } = req.body;
  const user = await userModel.findById(userId);
  if (!user)
    return res.status(400).json({ message: "No user found", success: false });
  if (!name) name = user.name;
  if (!email) email = user.email;
  if (!phone) phone = user.phone;
  const result = await userModel.findByIdAndUpdate(
    user._id,
    {
      name,
      email,
      phone,
    },
    { new: true }
  );
  if (result)
    return res.status(200).json({
      message: "Profile updated successfully",
      data: result,
      success: true,
    });
});

const userLogout = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId)
    return res
      .status(400)
      .json({ message: "Provide User ID.", success: false });

  await userModel.findByIdAndUpdate(userId, { active: false }, { new: true });

  return res
    .status(200)
    .json({ message: "User Logged Out Successfully.", success: true });
});

export {
  userRegistration,
  userLogin,
  userProfileUpdateController,
  userAuthController,
  userLogout,
};
