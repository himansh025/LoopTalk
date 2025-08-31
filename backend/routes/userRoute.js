import express from "express";
import { allUsers, getOtherUsers, login, logout, register } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/register",register)
router.post("/login",login)
router.post("/logout",logout)
router.get("/all",allUsers)
router.get("/",isAuthenticated,getOtherUsers);

export default router;