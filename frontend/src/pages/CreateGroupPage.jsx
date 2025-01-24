import React, { useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateGroupPage = () => {

    const navigate = useNavigate();

  const {isCreatingGroup,createGroup} = useAuthStore()
  const { users } = useChatStore();
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleCheckboxChange = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createGroup({
        groupName,
        members: selectedMembers,
      });

      // Navigate to the homepage after successful group creation
      navigate('/');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };
  return (
    <div className="flex justify-center min-h-screen items-center bg-base-100">
      <div className="card w-full max-w-lg shadow-lg bg-base-200">
        <div className="card-body">
          <h2 className="card-title text-lg font-bold">Create a New Group</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Group Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Group Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Members Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Select Members</span>
              </label>
              <div className="max-h-40 overflow-y-auto border rounded-lg p-2 bg-base-100">
                {users.map((user) => (
                  <label key={user._id} className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-md"
                      checked={selectedMembers.includes(user._id)}
                      onChange={() => handleCheckboxChange(user._id)}
                    />
                     <img
                        src={user.profilePic || "/avatar.png"}
                        alt={user.name}
                        className="size-10 object-cover rounded-full"
                    />
                    <span className="text-md">{user.fullName}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full">
                {isCreatingGroup ?
                <>
                 <Loader2 className="h-5 w-5 animate-spin" />
                 Creating...
                </>
                : "Create Group"
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage;
