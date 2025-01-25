import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users,CirclePlus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const { users , selectedUser, getUsers,setSelectedUser,isUserLoading,isBroadcastSelected,setIsBroadcastSelected,groups,getGroups,setSelectedGroup,selectedGroup} = useChatStore()
    const [showOnlineOnly,setShowOnlineOnly] = useState(false);
    const {onlineUsers} = useAuthStore()
    
    useEffect(()=>{
        getUsers()
        getGroups()
    },[getUsers,getGroups]);

    const filteredUsers = showOnlineOnly ? users.filter((user)=>onlineUsers.includes(user._id)) : users;

    if(isUserLoading) return <SidebarSkeleton/>;

  return (
    <aside className="h-full w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium block">Contacts</span>
          </div>
          <Link to={"/create-group"} className="relative group">
            <CirclePlus className="size-5 cursor-pointer" />
            <span 
              className="absolute hidden group-hover:inline-block 
              px-2 py-1 bg-gray-700 text-white text-xs rounded-md 
              -left-8 "
            >
              Create Group
            </span>
          </Link>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>


     <div className='overflow-y-auto w-full py-3'>
      {/*Broadcast Channel*/}
      <button
            onClick={() => {
              setSelectedGroup(null);
              setSelectedUser(null);
              setIsBroadcastSelected(true);
            }}
            className={`
              w-full p-3 flex items-center gap-3 
              hover:bg-base-300 transition-colors
              ${isBroadcastSelected ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative  lg:mx-0">
            <img
                src= "/mike.png"
                alt="broadcast"
                className="size-12 object-cover rounded-full"
              />  
            </div>

            {/* User info - only visible on larger screens */}
            <div className="block text-left min-w-0">
              <div className="font-medium truncate">Broadcast Channel</div>
            </div>
          </button>
     {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              setIsBroadcastSelected(false);
              setSelectedGroup(null);
            }}
            className={`
              w-full p-3 flex items-center gap-3 
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative  lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
{filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}

        {/*Group Section */}
        <div className="mt-4">
        <h3 className="text-sm font-medium text-zinc-500 px-3">Groups</h3>
        <div className="overflow-y-auto w-full py-3">
          {groups.map((group) => (
            <button
              key={group._id}
              onClick={() => {
                setSelectedGroup(group);
                setIsBroadcastSelected(false);
                setSelectedUser(null);
              }}
              className={`w-full p-3 flex items-center gap-3 
                hover:bg-base-300 transition-colors
                ${selectedGroup?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                ` }
                
            >
              <div className="relative">
                <img src={group.groupPic || "/group.png"}
                alt={group.groupName}
                className="size-12 object-cover rounded-full"/>
              </div>
              <div className="block text-left min-w-0">
                <div className="font-medium truncate">{group.groupName}</div>
                <div className="text-sm text-zinc-400">{group.members.length} members</div>
              </div>
            </button>
          ))}
          </div>
        </div>
     </div>
            
    </aside>
  )
}

export default Sidebar
