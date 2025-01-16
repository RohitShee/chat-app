import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";


const BroadcastHeader = () => {
  const { setIsBroadcastSelected} = useChatStore();
  const { authUser } = useAuthStore();
  return (
    <div className="p-2.5 border-b border-base-300">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="avatar">
          <div className="size-10 rounded-full relative">
            <img src= "/mike.png" alt="Broadcast Channel"/>
          </div>
        </div>

        <div>
          <h3 className="font-medium">Broadcast Channel</h3>
        </div>
      </div>

      
      
         {/* Close button */}
         <button onClick={() => setIsBroadcastSelected(false)}>
           <X />
         </button>
    </div>
  </div>
  )
}

export default BroadcastHeader
