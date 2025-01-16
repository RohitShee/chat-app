import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { broadcastMessage, getBroadcastMessages, getMessages,getUsersForSidebar, sendMessages } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/user',protectRoute,getUsersForSidebar)
router.post('/send/:id',protectRoute,sendMessages)
router.post('/broadcast',protectRoute,broadcastMessage)
router.get('/broadcastMessages',protectRoute,getBroadcastMessages)
router.get('/:id',protectRoute,getMessages)
export default router;