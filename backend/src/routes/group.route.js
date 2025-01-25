import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createGroup, getGroupInfo, getGroupMessages, getGroupsForUser, sendGroupMessage } from '../controllers/group.controller.js';

const router = express.Router();

router.post('/create',protectRoute,createGroup)
router.get('/group',protectRoute,getGroupsForUser)
router.get('/messages/:id',protectRoute,getGroupMessages)
router.post('/sendMessage/:id',protectRoute,sendGroupMessage)
router.get('/:id',protectRoute,getGroupInfo)
export default router;