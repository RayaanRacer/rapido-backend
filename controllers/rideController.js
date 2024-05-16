import rideModel from "../models/rideModel.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";
import driverModel from "../models/driverModel.js";
import Payment from "../models/paymentModel.js";

const createRideByUser = asyncHandler(async (req, res) => {
  const {
    userId,
    driverId,
    date,
    time,
    currentCity,
    currentLocation,
    destinationLocation,
  } = req.body;
  if (
    !userId ||
    !driverId ||
    !date ||
    !time ||
    !currentCity ||
    !currentLocation ||
    !destinationLocation
  )
    return res
      .status(400)
      .json({ message: "Provide complete Data.", success: false });

  const user = await userModel.findById(userId);
  if (!user)
    return res.status(400).json({ message: "User not found.", success: false });
  if (!user.available)
    return res
      .status(400)
      .json({ message: "Please complete your current Ride.", success: false });
  const driver = await driverModel.findById(driverId);
  if (!driver)
    return res
      .status(400)
      .json({ message: "Driver not found.", success: false });
  if (!driver.available)
    return res.status(400).json({
      message: "Driver has just assigned to another Ride.",
      success: false,
    });

  const newRide = new rideModel({
    user: userId,
    driver: driverId,
    currentCity: currentCity,
    currentLocation: currentLocation,
    destinationLocation: destinationLocation,
    date: date,
    time: time,
    status: "Pending",
  });

  await newRide.save();
  return res
    .status(200)
    .json({ message: "Ride is added to the Portal.", success: false });
});

const driverAmountSent = asyncHandler(async (req, res) => {
  const { rideId, amount } = req.body;
  if (!rideId || !amount)
    return res.status(400).json({
      message: "Provide Complete Data.",
      success: false,
    });

  const ride = await rideModel.findById(rideId);
  if (!ride)
    return res.status(400).json({
      message: "No such ride exists.",
      success: false,
    });
  await rideModel.findByIdAndUpdate(
    rideId,
    { status: "Amount Sent", amount: amount },
    { new: true }
  );
  return res.status(200).json({
    message: "Ride Amount Sent successfully.",
    success: true,
  });
});

const userAmountApproved = asyncHandler(async (req, res) => {
  const { rideId, amount } = req.body;
  if (!rideId || !amount)
    return res.status(400).json({
      message: "Provide Complete Data.",
      success: false,
    });

  const ride = await rideModel.findById(rideId);
  if (!ride)
    return res.status(400).json({
      message: "No such ride exists.",
      success: false,
    });
  await rideModel.findByIdAndUpdate(
    rideId,
    { status: "Amount Approved" },
    { new: true }
  );
  return res.status(200).json({
    message: "Ride Amount Approved successfully.",
    success: true,
  });
});

const userAmountDeclined = asyncHandler(async (req, res) => {
  const { rideId } = req.body;
  if (!rideId)
    return res.status(400).json({
      message: "Provide Complete Data.",
      success: false,
    });

  const ride = await rideModel.findById(rideId);
  if (!ride)
    return res.status(400).json({
      message: "No such ride exists.",
      success: false,
    });
  await rideModel.findByIdAndUpdate(
    rideId,
    { status: "Cancelled" },
    { new: true }
  );
  return res.status(200).json({
    message: "Ride Cancelled successfully.",
    success: true,
  });
});

const confirmRideByDriver = asyncHandler(async (req, res) => {
  const { rideId } = req.body;
  if (!rideId)
    return res.status(400).json({
      message: "Provide Complete Data.",
      success: false,
    });

  const ride = await rideModel.findById(rideId);
  if (!ride)
    return res.status(400).json({
      message: "No such ride exists.",
      success: false,
    });

  await rideModel.findByIdAndUpdate(
    rideId,
    { status: "Confirmed" },
    { new: true }
  );
  return res.status(200).json({
    message: "Ride approved successfully.",
    success: true,
  });
});

const cancelledRideByDriver = asyncHandler(async (req, res) => {
  const { rideId } = req.body;
  if (!rideId)
    return res.status(400).json({
      message: "Provide Complete Data.",
      success: false,
    });

  const ride = await rideModel.findById(rideId);
  if (!ride)
    return res.status(400).json({
      message: "No such ride exists.",
      success: false,
    });

  await rideModel.findByIdAndUpdate(
    rideId,
    { status: "Cancelled", cancel: "Driver" },
    { new: true }
  );
  return res.status(200).json({
    message: "Ride cancelled successfully.",
    success: true,
  });
});

const cancelledRideByUser = asyncHandler(async (req, res) => {
  const { rideId } = req.body;
  if (!rideId)
    return res.status(400).json({
      message: "Provide Complete Data.",
      success: false,
    });

  const ride = await rideModel.findById(rideId);
  if (!ride)
    return res.status(400).json({
      message: "No such ride exists.",
      success: false,
    });

  await rideModel.findByIdAndUpdate(
    rideId,
    { status: "Cancelled", cancel: "User" },
    { new: true }
  );
  return res.status(200).json({
    message: "Ride cancelled successfully.",
    success: true,
  });
});

const startOTP = asyncHandler(async (req, res) => {
  const { rideId } = req.body;
  if (!rideId)
    return res.status(400).json({
      message: "Provide Complete Data.",
      success: false,
    });

  const ride = await rideModel.findById(rideId);
  if (!ride)
    return res.status(400).json({
      message: "No such ride exists.",
      success: false,
    });
  const min = 1000;
  const max = 9999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  await rideModel.findByIdAndUpdate(
    rideId,
    { startOTP: randomNumber },
    { new: true }
  );
  return res.status(200).json({
    message: "OTP sent to User successfully.",
    data: randomNumber,
    success: true,
  });
});

const verifyStartOTP = asyncHandler(async (req, res) => {
  const { rideId, startOTP } = req.body;
  if (!rideId || !startOTP)
    return res.status(400).json({
      message: "Provide Complete Data.",
      success: false,
    });

  const ride = await rideModel.findById(rideId);
  if (!ride)
    return res.status(400).json({
      message: "No such ride exists.",
      success: false,
    });
  if (ride.startOTP !== startOTP)
    return res.status(400).json({
      message: "wrong OTP",
      success: false,
    });
  await rideModel.findByIdAndUpdate(
    rideId,
    { status: "Initiated" },
    { new: true }
  );
  return res.status(200).json({
    message: "Ride Initiated Successfully.",
    success: true,
  });
});

const endOTP = asyncHandler(async (req, res) => {
  const { rideId } = req.body;
  if (!rideId)
    return res.status(400).json({
      message: "Provide Complete Data.",
      success: false,
    });

  const ride = await rideModel.findById(rideId);
  if (!ride)
    return res.status(400).json({
      message: "No such ride exists.",
      success: false,
    });
  const min = 1000;
  const max = 9999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  await rideModel.findByIdAndUpdate(
    rideId,
    { endOTP: randomNumber },
    { new: true }
  );
  return res.status(200).json({
    message: "OTP sent to User successfully.",
    data: randomNumber,
    success: true,
  });
});

const verifyEndOTP = asyncHandler(async (req, res) => {
  const { rideId, endOTP } = req.body;
  if (!rideId || !endOTP)
    return res.status(400).json({
      message: "Provide Complete Data.",
      success: false,
    });

  const ride = await rideModel.findById(rideId);
  if (!ride)
    return res.status(400).json({
      message: "No such ride exists.",
      success: false,
    });
  if (ride.endOTP !== endOTP)
    return res.status(400).json({
      message: "wrong OTP",
      success: false,
    });
  await rideModel.findByIdAndUpdate(
    rideId,
    { status: "Completed" },
    { new: true }
  );
  return res.status(200).json({
    message: "Ride Completed Successfully.",
    success: true,
  });
});

const userRideList = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId)
    return res.status(400).json({
      message: "Provide Complete Data.",
      success: false,
    });
  const rideList = await rideModel.find({ user: userId });
  if (rideList.length === 0)
    return res.status(400).json({
      message: "Provide Complete Data.",
      success: false,
    });
  return res.status(200).json({
    message: "Ride List sent successfully.",
    success: true,
    data: rideList,
  });
});

const driverRideList = asyncHandler(async (req, res) => {
  const { driverId } = req.body;
  if (!driverId)
    return res.status(400).json({
      message: "Provide Complete Data.",
      success: false,
    });
  const rideList = await rideModel.find({ driver: driverId });
  if (rideList.length === 0)
    return res.status(400).json({
      message: "Provide Complete Data.",
      success: false,
    });
  return res.status(200).json({
    message: "Ride List sent successfully.",
    success: true,
    data: rideList,
  });
});

const createRazorpayOrder = async (req, res) => {
  const { userId, driverId, amount, rideId } = req.body;
  if (!userId || !driverId || !amount || !rideId)
    return res
      .status(400)
      .json({ message: "Provide user id.", success: false });
  const options = {
    amount: amount * 100,
    currency: "INR",
  };

  const { id, status } = await razorpay.orders.create(options);
  if (status !== "created")
    return res.status(400).json({ message: "Order is not created" });

  const orderData = {
    id,
    amount: amount * 100,
    currency: "INR",
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  };
  // Get the current date
  const today = new Date();

  // Create an array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Format the date
  const formattedDate = `${today.getDate()}-${
    monthNames[today.getMonth()]
  }-${today.getFullYear()}`;

  const createdOrder = new Payment({
    userId,
    driverId,
    paymentDate: formattedDate.toString(),
    totalAmount: amount,
    razorpayOrderId: id,
  });
  const result = await createdOrder.save();
  await rideModel.findByIdAndUpdate(
    rideId,
    { payment: result._id },
    { new: true }
  );
  if (!result)
    return res
      .status(400)
      .json({ message: "Order is not saved", success: false });
  return res.status(200).json({ data: orderData, success: true });
};

const verifySignature = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");
  if (generatedSignature === razorpay_signature) {
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        paymentStatus: "Fully Paid",
        razorpaySignature: razorpay_signature,
        razorpayPaymentId: razorpay_payment_id,
        paymentDate: Date.now(),
      },
      { new: true }
    );

    await rideModel.findOneAndUpdate(
      { payment: razorpay_order_id },
      { status: "Completed" },
      { new: true }
    );
    return res.status(200).json({ success: true });
  }
  return res.status(400).json({ success: false });
};

const checkStatus = async (req, res) => {
  const { orderID } = req.body;
  if (!orderID)
    return res
      .status(400)
      .json({ message: "Provide order ID.", success: false });
  const order = await Payment.findOne({ razorpayOrderId: orderID });
  if (order.paymentStatus === "Fully Paid")
    return res.status(200).json({ message: "Order is paid", success: true });
  console.log(order);
  return res
    .status(400)
    .json({ message: "Order Payment is pending.", success: false });
};

export {
  createRideByUser,
  confirmRideByDriver,
  cancelledRideByDriver,
  cancelledRideByUser,
  startOTP,
  verifyStartOTP,
  endOTP,
  verifyEndOTP,
  userRideList,
  driverRideList,
  userAmountApproved,
  userAmountDeclined,
  createRazorpayOrder,
  verifySignature,
  driverAmountSent,
  checkStatus,
};
