import driverModel from "../models/driverModel.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const driverRegistration = asyncHandler(async (req, res) => {
  const { name, email, phone, password, address, currentLocation } = req.body;

  if (!name || !email || !phone || !password || !address || !currentLocation)
    return res.status(400).json({
      message: "Please provide complete information.",
      success: false,
    });

  if (phone.length !== 10)
    return res.status(400).json({
      message: "Phone number should be of 10 numbers",
      success: false,
    });
  const registeredDriver = await driverModel.findOne({
    $or: [{ email: email }, { phone: phone }],
  });
  if (registeredDriver) {
    return res.status(400).json({
      message: `Driver is already registered with email ${email}`,
      success: false,
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const Driver = new driverModel({
    name,
    email,
    phone,
    password: hashedPassword,
    address,
    currentLocation,
  });
  const result = await Driver.save();
  if (result) {
    return res.status(200).json({
      message: `Driver is registered successfully.`,
      data: result,
      success: true,
    });
  }
});

const driverLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(404).json({ message: "Provide complete data" });

  const driver = await driverModel.findOne({
    email: email,
  });
  if (!driver) {
    return res
      .status(404)
      .json({ message: "No account is associated with this email." });
  }
  const isMatch = await bcrypt.compare(password, driver.password);
  if (!isMatch)
    return res.status(404).json({ message: "Password doesn't match." });
  await driverModel.findByIdAndUpdate(
    driver._id,
    { active: true },
    { new: true }
  );
  const token = jwt.sign({ id: driver._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return res
    .status(200)
    .json({
      message: "Login Success",
      success: true,
      token,
      data: { id: driver._id },
    });
});

const getAllDrivers = asyncHandler(async (req, res) => {
  const drivers = await driverModel.find({}).select("-password");
  return res.status(200).json({
    message: "Drivers sent successfully.",
    data: drivers,
    success: true,
  });
});

const getDriver = asyncHandler(async (req, res) => {
  const { driverId } = req.body;
  const driver = await driverModel.findById(driverId).select("-password");
  if (!driver) return res.status(400).json({ message: "No driver found." });
  return res
    .status(200)
    .json({ message: "driver sent successfully.", data: driver });
});

const updateDriverProfile = asyncHandler(async (req, res) => {
  const { driverId } = req.body;
  const driver = await driverModel.findById(driverId);
  if (!driver) return res.status(400).json({ message: "No driver found." });
  let { name, email, phone, address, currentLocation } = req.body;
  if (!name) name = driver.name;
  if (!email) email = driver.email;
  if (!phone) phone = driver.phone;
  if (!address) address = driver.address;
  if (!currentLocation) currentLocation = driver.currentLocation;

  const result = await driverModel.findByIdAndUpdate(
    driverId,
    {
      name: name,
      email: email,
      phone: phone,
      currentLocation: currentLocation,
      address: address,
    },
    { new: true }
  );
  if (result)
    return res
      .status(200)
      .json({ message: "driver Profile Updated successfully.", data: driver });
});

const driverLogout = asyncHandler(async (req, res) => {
  const driverId = req.params.driverId;
  if (!driverId) return res.status(400).json({ message: "Provide driver Id" });

  await driverModel.findByIdAndUpdate(
    driverId,
    { online: false },
    { new: true }
  );
  return res.status(200).json({ message: "Logged Out successfully." });
});

export {
  driverRegistration,
  driverLogin,
  getAllDrivers,
  getDriver,
  updateDriverProfile,
  driverLogout,
};
