import React, { useEffect, useState } from "react";
import { Camera, User, Users, Plus, MoreVertical, Trash, ShieldCheck, ShieldX } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGroupStore } from "../store/useGroupStore";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const GroupDetailsPage = () => {
  const { id: groupId } = useParams();
  const { authUser } = useAuthStore();
  const { userIdToUserMap, getUsers, users } = useChatStore();
  const {
    group,
    isUpdatingGroup,
    updateGroupPic,
    fetchGroupInfo,
    addMemberToGroup,
    makeAdmin,
    removeAdmin,
    removeMember
  } = useGroupStore();

  const [selectedImage, setSelectedImage] = useState(null);
  const [newMemberId, setNewMemberId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getUsers();
    fetchGroupInfo(groupId);
  }, [groupId]);

  const nonGroupUsers = users.filter((user) => !group?.members?.includes(user._id));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateGroupPic({ groupPic: base64Image });
    };
  };

  const handleAddMember = async () => {
    if (!newMemberId) return;
    await addMemberToGroup(newMemberId);
    fetchGroupInfo(groupId);
    setNewMemberId("");
  };

  const handleMakeAdmin = async (userId) => {
    await makeAdmin(userId);
    fetchGroupInfo(groupId);
    setSelectedUser(null);
  };

  const handleRemoveAdmin = async (userId) => {
    await removeAdmin(userId);
    fetchGroupInfo(groupId);
    setSelectedUser(null);
  };

  const handleRemoveMember = async (userId) => {
    await removeMember(userId);
    fetchGroupInfo(groupId);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen p-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">{group.groupName}</h1>
            <p className="mt-2">Group Details</p>
          </div>

          {/* Group Picture Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImage || group.groupPic || "/group.png"}
                alt="Group"
                className="size-32 rounded-full object-cover border-4"
              />
              <label htmlFor="group-upload" className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200">
                <Camera className="w-5 h-5 text-base-200" />
                <input type="file" id="group-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            <p className="text-sm text-zinc-400">{isUpdatingGroup ? "Uploading..." : "Click the camera icon to update the group photo"}</p>
          </div>

          {/* Group Information */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Created By
              </div>
              <div className="flex justify-between px-4 py-2.5 bg-base-200 rounded-lg border">
                <p>{userIdToUserMap[group.creator]?.fullName}</p>
                <p>{group.createdAt?.split("T")[0]}</p>
              </div>
            </div>
          </div>

          {/* Add Member Section */}
          {group?.admins?.includes(authUser._id) && (
            <div className="bg-base-200 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">Add New Member</h2>
              <div className="flex gap-3">
                <select className="select select-bordered w-full max-w-xs" value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)}>
                  <option value="">Select a user</option>
                  {nonGroupUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
                <button className="btn btn-primary flex items-center gap-2" onClick={handleAddMember}>
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          )}

          {/* Members List */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="size-6" />
              <h2 className="text-lg font-medium">Members</h2>
            </div>
            <div className="space-y-3 text-sm">
              {group?.members?.map((member) => (
                <div key={member} className="relative flex items-center justify-between py-2 border-b border-zinc-700">
                  <div className="flex items-center gap-3">
                    <img src={userIdToUserMap[member]?.profilePic || "/avatar.png"} alt={userIdToUserMap[member]?.fullName} className="w-8 h-8 rounded-full object-cover" />
                    <span>{userIdToUserMap[member]?.fullName}</span>
                  </div>

                  <span className={group.admins.includes(member) ? "text-green-500" : "text-zinc-400"}>
                    {group.admins.includes(member) ? "Admin" : "Member"}
                  </span>

                  {/* Dropdown for Admin Actions */}
                  {authUser._id !== member && group.admins.includes(authUser._id) && (
                    <div className="relative">
                      <button onClick={() => setSelectedUser(selectedUser === member ? null : member)} className="btn btn-sm btn-ghost">
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {selectedUser === member && (
                        <ul className="absolute right-10 bottom-0 bg-base-200 p-2 rounded shadow-lg space-y-2 w-40">
                          {!group.admins.includes(member) ? (
                            <li className="p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => handleMakeAdmin(member)}>
                              <ShieldCheck className="w-4 h-4 mr-2 text-blue-500" />
                              Make Admin
                            </li>
                          ) : (
                            <li className="p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => handleRemoveAdmin(member)}>
                              <ShieldX className="w-4 h-4 mr-2 text-red-500" />
                              Remove Admin
                            </li>
                          )}

                          {group.creator !== member && (
                            <li className="p-2 text-red-500 hover:bg-red-600 rounded cursor-pointer" onClick={() => handleRemoveMember(member)}>
                              <Trash className="w-4 h-4 mr-2" />
                              Remove Member
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage;
