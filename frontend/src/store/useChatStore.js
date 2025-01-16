import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set,get) => ({
    messages : [],
    users : [],
    selectedUser : null,
    isUsersLoading : false,
    isMessageLoading : false,
    isBroadcastSelected : false,

    setIsBroadcastSelected : (isBroadcastSelected) =>{
        if(isBroadcastSelected){
            const {setSelectedUser} =get()
            setSelectedUser(null);
        }
        set({isBroadcastSelected});
    },

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
    subscribeToMessages : () =>{
        const {selectedUser} = get();
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        socket.on("newMessage",(newMessage)=>{
            if(newMessage.senderId !== selectedUser._id) return;
            set({messages : [...get().messages,newMessage]})
        })
    },
    unsubscribeFromMessages : () =>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser : (selectedUser)=>{
        set({selectedUser : selectedUser})
    },
    broadcastMessage : async(messageData)=>{
        const {messages} = get()
        try {
            const res = await axiosInstance.post(`/messages/broadcast`,messageData);
            set({messages : [...messages,res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    getBroadcastMessage : async()=>{
        set({isMessageLoading : true});
        try {
            const res = await axiosInstance.get('/messages/broadcastMessages');
            set({messages : res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isMessageLoading : false});
        }
    }
}))