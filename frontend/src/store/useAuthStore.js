import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = 'http://localhost:8000';

export const useAuthStore = create((set,get)=>({
    authUser : null,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,
    onlineUsers : [],
    isCheckingAuth : true,
    socket : null,
    isCreatingGroup : false,
    checkAuth : async () =>{
        try {
            const res = await axiosInstance.get("auth/check");
            set({authUser : res.data});
            get().connectSocket();
        } catch (error) {
            set({authUser : null});
        }finally{
            set({isCheckingAuth : false});
        }
    },
    signup : async(data) =>{
        set({isSigningUp : true})
        try {
            const res = await axiosInstance.post('auth/signup',data);
            set({authUser : res.data});
            toast.success('Account created Successfully');
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isSigningUp : false})
        }
    },

    logout : async() =>{
        try {
            axiosInstance.post('auth/logout');
            set({authUser : null});
            toast.success('Logged Out Successfully')
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    login : async(data) =>{
        set({isLoggingIn : true});
        try {
            const res = await axiosInstance.post('auth/login',data);
            set({authUser : res.data});
            toast.success('Logged In Successfully');
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isLoggingIn : false})
        }
    },
    updateProfile : async(data) => {
        set({isUpadatingProfile : true});
        try {
            const res = await axiosInstance.put('/auth/update-profile',data);
            set({authUser : res.data});
            toast.success('Profile Picture Updated Successfully');
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isUpadatingProfile : false});
        }
    },
    connectSocket : () =>{
        const {authUser} = get();
        if(!authUser && get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query :{
                userId : authUser._id
            }
        });
        set({socket : socket})
        socket.connect()
        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers : userIds});
        })
    },
    disconnectSocket : () =>{
        if(get().socket?.connected) get().socket.disconnect();
    },
    createGroup : async(data) =>{
        set({isCreatingGroup : true});
        try {
           const res = await axiosInstance.post('/group/create',data)
           console.log(res.data);
           toast.success('Group Updated Successfully');
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isCreatingGroup : false});
        }
    }
    
}))