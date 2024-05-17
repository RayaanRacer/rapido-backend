import express from "express";
import {
  driverLogin,
  driverLogout,
  driverRegistration,
  getAllDrivers,
  getDriver,
  updateDriverProfile,
} from "../controllers/driverController.js";

const router = express.Router();

router.post("/driver-registration", driverRegistration);
router.post("/driver-login", driverLogin);
router.post("/driver-logout", driverLogout);
router.get("/get-all-drivers", getAllDrivers);
router.post("/get-driver", getDriver);
router.put("/update-driver-profile", updateDriverProfile);

export default router;
