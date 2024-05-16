import express from "express";
import {
  cancelledRideByDriver,
  cancelledRideByUser,
  checkStatus,
  confirmRideByDriver,
  createRazorpayOrder,
  createRideByUser,
  driverAmountSent,
  driverRideList,
  endOTP,
  startOTP,
  userAmountApproved,
  userAmountDeclined,
  userRideList,
  verifyEndOTP,
  verifySignature,
  verifyStartOTP,
} from "../controllers/rideController.js";

const router = express.Router();

router.post("/create-ride", createRideByUser);
router.post("/driver-amount-sent", driverAmountSent);
router.post("/user-amount-approved", userAmountApproved);
router.post("/user-amount-declined", userAmountDeclined);
router.post("/confirm-ride-by-rider", confirmRideByDriver);
router.post("/cancelled-ride-by-riider", cancelledRideByDriver);
router.post("/cancelled-ride-by-user", cancelledRideByUser);
router.get("/start-otp", startOTP);
router.post("/verify-start-OTP", verifyStartOTP);
router.get("/end-OTP", endOTP);
router.post("/verify-end-OTP", verifyEndOTP);
router.get("/user-ride-list", userRideList);
router.get("/driver-get-list", driverRideList);
router.post("/create-razprpay-order", createRazorpayOrder);
router.post("/verify-signature", verifySignature);
router.get("/check--status", checkStatus);

export default router;
