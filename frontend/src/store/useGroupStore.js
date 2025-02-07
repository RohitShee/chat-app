import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from "react-hot-toast";
export const useGroupStore = create((set,get) => ({
  group: {},
  isUpdatingGroup: false,

  fetchGroupInfo: async (id) => {
    try {
      const response = await axiosInstance.get(`group/${id}`);
      //console.log(response.data);
      set({ group: response.data });
    } catch (error) {
      console.error('Error fetching group info:', error);
    }
  },

  updateGroupPic: async (data) => {
    set({ isUpdatingGroup: true });
    try {
      const res = await axiosInstance.put(`group/updatePic/${get().group._id}`, data);
      set({group : res.data});
      toast.success('Group Profile Picture Updated Successfully');
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUpdatingGroup: false });
    }
  },
  addMemberToGroup: async (memberId) => {
    try {
      const res = await axiosInstance.put(`group/addMember/${get().group._id}`,{memberId});
      set({group : res.data});
      toast.success('Member added Successfully');
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },
  makeAdmin: async (memberId) => {
    try {
      const res = await axiosInstance.put(`group/makeAdmin/${get().group._id}`,{memberId});
      set({group : res.data});
      toast.success('Admin added Successfully');
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },
  removeAdmin: async (memberId) => {
    try {
      const res = await axiosInstance.put(`group/removeAdmin/${get().group._id}`,{memberId});
      set({group : res.data});
      toast.success('Admin removed Successfully');
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },
  removeMember: async (memberId) => {
    try {
      const res = await axiosInstance.put(`group/removeMember/${get().group._id}`,{memberId});
      set({group : res.data});
      toast.success('Admin removed Successfully');
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },
}));
