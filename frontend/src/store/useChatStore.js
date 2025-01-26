import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set,get) => ({
    messages : [],
    users : [],
    groups :[],
    userIdToUserMap :{},
    selectedUser : null,
    isUsersLoading : false,
    isMessageLoading : false,
    isBroadcastSelected : false,
    selectedGroup : null,
    setIsBroadcastSelected : (isBroadcastSelected) =>{
        set({isBroadcastSelected});
    },

    getUsers : async () =>{
        const {userIdToUserMap} = get();
        set({isUsersLoading : true});
        try {
            const res = await axiosInstance.get("/messages/user");
            set({users : res.data});
            res.data.forEach( user => {
                userIdToUserMap[user._id]={
                    fullName : user.fullName,
                    profilePic : user.profilePic
                };
            });
            //console.log(userIdToUserMap);
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isUsersLoading : false});
        }
    },
    getGroups : async() =>{
        set({isUsersLoading : true});
        try {
            const res = await axiosInstance.get("/group/group");
            set({groups : res.data});
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
        const {selectedUser,selectedGroup} = get();
        if(!selectedUser && !selectedGroup) return;
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
        //socket.off("newGroupMessage")
        //console.log("subscribe to msg")
        socket.on("newMessage",(newMessage)=>{
           // console.log("we are getting new msg from web socket")
            if(newMessage.senderId === selectedUser._id){
            set({messages : [...get().messages,newMessage]})
            }
        })
        socket.off("newGroupMessage").on("newGroupMessage", (newGroupMessage) => {
            if (selectedGroup && newGroupMessage.groupId === selectedGroup._id) {
                //console.log("Received new group message:", newGroupMessage);
                set((state) => ({
                    messages: [...state.messages, newGroupMessage],
                }));
            }
        });
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
    },
    setSelectedGroup : (selectedGroup) =>{
        set({selectedGroup : selectedGroup})
    },
    getGroupMessages : async(groupId)=>{
        set({isMessageLoading : true});
        try {
            const res = await axiosInstance.get(`/group/messages/${groupId}`)
            set({messages : res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isMessageLoading : false});
        }
    },
    sendGroupMessage : async(messagedata)=>{
        const {selectedGroup,messages} = get()
        try {
            const res = await axiosInstance.post(`/group/sendMessage/${selectedGroup._id}`,messagedata);
            set({messages : [...messages,res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}))