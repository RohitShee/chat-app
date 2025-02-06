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
      await axiosInstance.put(`group/updatePic/${get().group._id}`, data);
      set({group : res.data});
      toast.success('Group Profile Picture Updated Successfully');
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUpdatingGroup: false });
    }
  }
}));
