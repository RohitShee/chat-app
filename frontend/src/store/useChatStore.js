import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useChatStore = create((set,get) => ({
    messages : [],
    users : [],
    selectedUser : null,
    isUsersLoading : false,
    isMessageLoading : false,


    getUsers : async () =>{
        set({isUsersLoading : true});
        try {
            const res = await axiosInstance.get("/messages/user");
            set({users : res.data});
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isUsersLoading : false});
        }
    },
    getMessages : async (userId) =>{
        set({isMessageLoading : true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({messages : res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isMessageLoading : false});
        }
    },
    sendMessage : async(messageData) =>{
        const {selectedUser,messages} = get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages : [...messages,res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    setSelectedUser : (selectedUser)=>{
        //console.log(selectedUser)
        set({selectedUser : selectedUser})
    }
}))