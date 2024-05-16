import express from "express";
import {
  userAuthController,
  userLogin,
  userLogout,
  userProfileUpdateController,
  userRegistration,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/user-registration", userRegistration);
router.post("/user-login", userLogin);
router.get("/user-auth", userAuthController);
router.put("/user-profile-update/:userId", userProfileUpdateController);
router.get("/user-logout/:userId", userLogout);

export default router;
