import express from "express";
import {
    getHobbySuggestions,
    getGraphData,
    addHobby,
    removeHobby
} from "../controllers/hobbyController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/suggestions", isAuthenticated, getHobbySuggestions);
router.get("/graph", isAuthenticated, getGraphData);
router.post("/add", isAuthenticated, addHobby);
router.post("/remove", isAuthenticated, removeHobby);

export default router;
