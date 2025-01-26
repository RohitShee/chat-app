import React, { useEffect,useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';
import BroadcastHeader from './BroadcastHeader';
import GroupChatHeader from './GroupChatHeader';

const ChatContainer = () => {

  const{selectedUser,
    messages,getMessages,isMessageLoading,subscribeToMessages,unsubscribeFromMessages,
    isBroadcastSelected,getBroadcastMessage,
    selectedGroup,getGroupMessages,userIdToUserMap } = useChatStore();
  const{authUser} = useAuthStore()
  const messageEndRef = useRef(null);
  
  useEffect(() => {
    if (isBroadcastSelected) {
      getBroadcastMessage(); // Fetch broadcast messages
    } else if (selectedUser?._id) {
      getMessages(selectedUser._id); // Fetch user-specific messages
    }else if(selectedGroup?._id){
      getGroupMessages(selectedGroup._id);
    }
  
    subscribeToMessages();
    
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, isBroadcastSelected, subscribeToMessages, unsubscribeFromMessages]);
  

  useEffect(()=>{
    if(messageEndRef.current && messages)
    messageEndRef.current.scrollIntoView({behavior : "smooth"});
  },[messages])

  if(isMessageLoading) return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>
  )

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
       {selectedGroup ? (
        <GroupChatHeader />
      ) : isBroadcastSelected ? (
        <BroadcastHeader />
      ) : (
        <ChatHeader />
      )}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message)=>
          <div
          key ={message._id}
          className={`chat ${message.senderId==authUser._id ? "chat-end" : "chat-start"}`}
          ref={messageEndRef}
          >
            <div className='chat-image avatar'>
                <div className='size-10 rounded-full border'>
                  <img src={message.senderId === authUser._id 
                    ? authUser.profilePic || "/avatar.png"
                    : selectedGroup ? userIdToUserMap[message.senderId].profilePic || "/avatar.png"
                    : selectedUser?.profilePic || "/avatar.png"
                  } alt="" />
                </div>
            </div>
            <div className='chat-header mb-1'>
                <time className='text-xs opacity-50'>
                  {formatMessageTime(message.createdAt)}
                </time>
            </div>
            <div className={`chat-bubble ${message.senderId==authUser._id ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"} flex flex-col`}>
            {selectedGroup && message.senderId !== authUser._id && (
              <span className="text-xs font-bold mb-1">
              {userIdToUserMap[message.senderId]?.fullName || "Unknown User"}
              </span>
            )}
            {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        )}
      </div>
      <MessageInput/>
    </div>
  )
}

export default ChatContainer
