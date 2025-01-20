import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createGroup, getGroupInfo, getGroupsForUser } from '../controllers/group.controller.js';

const router = express.Router();

router.post('/create',protectRoute,createGroup)
router.get('/group',protectRoute,getGroupsForUser)
router.get('/:id',protectRoute,getGroupInfo)
export default router;