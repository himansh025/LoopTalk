import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getPendingRequests,
  removeFriend,
} from "../controllers/friendshipController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/send", isAuthenticated, sendFriendRequest);
router.put("/accept/:requestId", isAuthenticated, acceptFriendRequest);
router.put("/reject/:requestId", isAuthenticated, rejectFriendRequest);
router.get("/friends", isAuthenticated, getFriends);
router.get("/pending", isAuthenticated, getPendingRequests);
router.delete("/remove/:friendId", isAuthenticated, removeFriend);

export default router;
