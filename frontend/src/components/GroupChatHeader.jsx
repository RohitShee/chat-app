import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";


const GroupChatHeader = () => {
  const { setSelectedGroup,selectedGroup} = useChatStore();
  return (
    <div className="p-2.5 border-b border-base-300">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="avatar">
          <div className="size-10 rounded-full relative">
            <img src= {selectedGroup?.groupPic || "./group.png"} alt={selectedGroup?.groupName}/>
          </div>
        </div>

        <div>
          <h3 className="font-medium">{selectedGroup?.groupName}</h3>
          <p className="text-sm text-base-content/70">
            {selectedGroup?.members.length} members
          </p>
        </div>
      </div>

      
      
         {/* Close button */}
         <button onClick={() => setSelectedGroup(null)}>
           <X />
         </button>
    </div>
  </div>
  )
}

export default GroupChatHeader
