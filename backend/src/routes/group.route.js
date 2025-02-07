import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { addNewMember, createGroup, getGroupInfo, getGroupMessages, getGroupsForUser, makeAdmin, removeAdmin, removeMember, sendGroupMessage, updateGroupPic } from '../controllers/group.controller.js';

const router = express.Router();

router.post('/create',protectRoute,createGroup)
router.get('/group',protectRoute,getGroupsForUser)
router.get('/messages/:id',protectRoute,getGroupMessages)
router.post('/sendMessage/:id',protectRoute,sendGroupMessage)
router.put('/updatePic/:id',protectRoute,updateGroupPic)
router.put('/addMember/:id',protectRoute,addNewMember)
router.put('/removeMember/:id',protectRoute,removeMember)
router.put('/makeAdmin/:id',protectRoute,makeAdmin)
router.put('/removeAdmin/:id',protectRoute,removeAdmin)
router.get('/:id',protectRoute,getGroupInfo)
export default router;