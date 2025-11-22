import express from "express";
import { allUsers, getOtherUsers, login, logout, register,profile, updateUserProfile,getMe } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { upload } from "../middleware/multer.js";
const router = express.Router();

router.post("/register",register)
router.post("/login",login)
router.post("/logout",logout)
router.get("/all",allUsers)
router.get("/profile",isAuthenticated,profile)
router.put("/profile",isAuthenticated, upload.single('profilePic') ,updateUserProfile);
router.get("/me",isAuthenticated, getMe);
router.get("/",isAuthenticated,getOtherUsers);

export default router;