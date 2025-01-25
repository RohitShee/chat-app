import React from 'react'
import { useChatStore } from '../store/useChatStore'
import Sidebar from '../components/Sidebar';
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';

const HomePage = () => {
  const {selectedUser,isBroadcastSelected,selectedGroup} = useChatStore();
  return (
    <div className='min-h-screen bg-base-200'>
     <div className='flex items-center justify-center pt-20 px-4'>
      <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
        <div className='hidden md:flex h-full rounded-lg overflow-hidden'>
            <Sidebar />
            {(!selectedUser && !isBroadcastSelected && !selectedGroup) ? <NoChatSelected/> : <ChatContainer/>}
        </div>
        {/* ChatContainer or Sidebar for medium or smaller screens */}
        <div className="flex h-full rounded-lg overflow-hidden md:hidden">
              {(!selectedUser && !isBroadcastSelected && !selectedGroup)? <> <Sidebar /> <NoChatSelected/> </> : <ChatContainer />}
        </div>
      </div>
     </div>
    </div>
  )
}

export default HomePage
