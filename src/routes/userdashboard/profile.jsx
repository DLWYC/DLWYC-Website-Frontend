import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useRef } from 'react';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Upload, 
  FileText, 
  Trash2,
  Eye,
  Download,
  UserCircle,
  Lock,
  Settings,
  CreditCard,
  Shield,
  Bell,
  ChevronRight
} from 'lucide-react';
import {useAuth} from '@/lib/AuthContext'
import {documentTypes, sidebarItems} from '@/data/Dashboard'
import UserProfileImage from '@/components/UserProfileImage/UserProfileImage'
import ProfileField from "@/components/Profile/Profile"


export const Route = createFileRoute('/userdashboard/profile')({
  component: UserProfile,
})



function UserProfile(){
  const{userData} = useAuth()
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({...userData});
  const [profilePreview, setProfilePreview] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

   const handleEdit = () => {
    setIsEditing(true);
    setEditData({...userData});
    setProfilePreview(userData?.profilePicture);
  };


  

  const fileInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  
  const mainComponent = () =>{
      switch(activeTab){
        // #### {##################### This is the First TAB #####################3}
        case 'profile':
          return(
            <div className="p-3 relative">
            <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#0a1f55] rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: '#091e54' }}
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-6">

               <div className="relative">
               <div className="w-fit relative">

                 <UserProfileImage imageWidth={55} profilePicture={userData?.profilePicture} className='border border-gray-400' />
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-6 h-6 text-white rounded-full flex items-center justify-center hover:bg-[#0a1f55] transition-colors duration-200 cursor-pointer"
                      style={{ backgroundColor: '#091e54' }}
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    // onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
               </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  label="Full Name"
                  value={userData?.fullName}
                  field="fullName"
                  isEditing={isEditing}
                  editData={editData}
                  setEditData={setEditData}
                />
                <ProfileField
                  label="Email Address"
                  value={userData?.email}
                  field="email"
                  type="email"
                  isEditing={isEditing}
                  editData={editData}
                  setEditData={setEditData}
                />
                <ProfileField
                  label="Phone Number"
                  value={userData?.phoneNumber}
                  field="phoneNumber"
                  type="tel"
                  isEditing={isEditing}
                  editData={editData}
                  setEditData={setEditData}
                />
                <ProfileField
                  label="Gender"
                  value={userData?.gender}
                  field="gender"
                  isEditing={isEditing}
                  editData={editData}
                  setEditData={setEditData}
                />
                <ProfileField
                  label="Age"
                  value={userData?.age}
                  field="age"
                  isEditing={isEditing}
                  editData={editData}
                  setEditData={setEditData}
                />
                <ProfileField
                  label="Archdeaconry"
                  value={userData?.archdeaconry}
                  field="archdeaconry"
                  isEditing={isEditing}
                  editData={editData}
                  setEditData={setEditData}
                />
                <ProfileField
                  label="Parish"
                  value={userData?.parish}
                  field="parish"
                  isEditing={isEditing}
                  editData={editData}
                  setEditData={setEditData}
                />
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    // onClick={handleCancel}
                    className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    // onClick={handleSave}
                    className="px-6 py-2 text-white hover:bg-[#0a1f55] rounded-lg transition-colors duration-200"
                    style={{ backgroundColor: '#091e54' }}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
            </div>
          );

          case 'password':
        return (
          <div className="space-y-6 font-rubik">
            <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>

            <div className="space-y-6 ">
              <div className="space-y-4">
                <div>
                  <label className="block text-[15px] font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-[15px] font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                  Cancel
                </button>
                                  <button className="px-6 py-2 text-white hover:bg-[#0a1f55] rounded-lg transition-colors duration-200"
                    style={{ backgroundColor: '#091e54' }}>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        );
      }
  }



  // COMPONENT
  return(
    <div className="flex font-rubik">
    {/* Side Nav */}
 <div className="basis-[40%] bg-white hidden border border-red-500 ">
          <div className="p-3 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Account Profile</h1>
          </div>

          {/* Profile Summary */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col items-center text-center">
              {/* <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 mb-3 border"> */}
                {/* {userData?.profilePicture ? (
                  <UserProfileImage imageWidth={35} profilePicture={userData?.profilePicture} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserProfileImage imageWidth={35} profilePicture={userData?.profilePicture} />
                  </div>
                )} */}
                <UserProfileImage imageWidth={55} profilePicture={userData?.profilePicture} className='border border-red-400' />
              {/* </div> */}
              <h3 className="font-medium text-gray-900">{userData?.fullName}</h3>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-1  h-[350px] ">
            <ul className="space-y-2 ">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-4 text-left transition-colors duration-200 ${
                        activeTab === item.id
                          ? 'text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      style={activeTab === item.id ? { backgroundColor: '#091e54' } : {}}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[15px]">{item.label}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

         


        </div>
    {/* Side Nav */}

            <div className="w-full p-4">
        {mainComponent()}
            </div>
    </div>
  )
};









export default UserProfile;