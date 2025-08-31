import express from "express";
import { getMessage, sendMessage,getChats } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/send/:id",isAuthenticated,sendMessage);
router.get("/allChats",isAuthenticated, getChats);
router.get("/:id",isAuthenticated, getMessage);
export default router;