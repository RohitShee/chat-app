import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { blockUser, unblockUser } from "../controllers/user.controller.js";

const router = express.Router()

router.post('/block',protectRoute,blockUser);
router.post('/unblock',protectRoute,unblockUser);

export default router;