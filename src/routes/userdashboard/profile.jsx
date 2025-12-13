import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useRef } from 'react';
import { 
  Edit3, 
  Save, 
  X, 
  Camera, 
  UserCircle,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext'
import ProfileField from "@/components/Profile/Profile"
import axios from 'axios';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/userdashboard/profile')({
  component: UserProfile,
})

function UserProfile() {
  const { userData, updateUserData } = useAuth()
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...userData });
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
    const queryClient = useQueryClient()
  
  

  const backendURL = import.meta.env.VITE_BACKEND_URL
  const userToken = localStorage.getItem('token');

  const fileInputRef = useRef(null);

  // Show notification helper
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...userData });
    setProfilePreview(userData?.profilePicture);
  };

  // Handle input change for profile fields
  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'Image size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target.result);
        setProfileFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...userData });
    setProfilePreview(userData?.profilePicture);
    setProfileFile(null);
  };

  const validateProfileData = () => {
    const errors = {};
    
    if (!editData.fullName?.trim()) {
      errors.fullName = 'Full name is required';
    }
    
 
    
    if (editData.phoneNumber && !/^\+?[\d\s-()]+$/.test(editData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    return errors;
  };

  const handleSave = async () => {
  
  const errors = validateProfileData();
  
  if (Object.keys(errors).length > 0) {
    showNotification('error', Object.values(errors)[0]);
    return;
  }

  setIsSaving(true);

  try {
    const payload = {
      ...editData
    };

    if (profilePreview && profilePreview !== userData?.profilePicture) {
      payload.profilePicture = profilePreview;
    }

    const response = await axios.post(
      `${backendURL}/api/updateUserProfile`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Response:", response?.data);
    
    if (response.data.success) {
      // Update context with new data (if this function exists)
      if (updateUserData) {
        updateUserData(response.data.user);
      }
      
      
      // Invalidate and refetch user data
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      
      showNotification('success', 'Profile updated successfully!');
      setIsEditing(false);
      setProfileFile(null);
      
      // Navigate after a short delay to allow the cache to update
      setTimeout(() => {
        navigate({to: '/userdashboard'});
      }, 500);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
    showNotification('error', errorMessage);
  } finally {
    setIsSaving(false);
  }
};

  

  const renderNotification = () => {
    if (!notification) return null;

    const bgColor = notification.type === 'success' ? 'bg-green-50' : 'bg-red-50';
    const textColor = notification.type === 'success' ? 'text-green-800' : 'text-red-800';
    const borderColor = notification.type === 'success' ? 'border-green-200' : 'border-red-200';
    const Icon = notification.type === 'success' ? CheckCircle2 : AlertCircle;

    return (
      <div className={`fixed top-4 right-4 z-50 ${bgColor} ${textColor} border ${borderColor} rounded-lg p-4 shadow-lg flex items-center gap-3 max-w-md animate-in slide-in-from-top`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{notification.message}</p>
        <button
          onClick={() => setNotification(null)}
          className="ml-auto hover:opacity-70"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const mainComponent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="relative">

            <div className="space-y-2 py-5">
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
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                      {(profilePreview || userData?.profilePicture) ? (
                        <img
                          src={profilePreview || userData?.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserCircle className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-9 h-9 text-white rounded-full flex items-center justify-center hover:bg-[#0a1f55] transition-colors duration-200 cursor-pointer"
                        style={{ backgroundColor: '#091e54' }}
                        title="Change profile picture"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </div>
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-2">
                      Click the camera icon to change your profile picture (Max 5MB)
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="Full Name"
                    value={isEditing ? editData.fullName : userData?.fullName}
                    field="fullName"
                    isEditing={isEditing}
                    editData={editData}
                    setEditData={setEditData}
                    onChange={(value) => handleInputChange('fullName', value)}
                    required
                  />
                  <ProfileField
                    label="Phone Number"
                    value={isEditing ? editData.phoneNumber : userData?.phoneNumber}
                    field="phoneNumber"
                    type="tel"
                    isEditing={isEditing}
                    editData={editData}
                    setEditData={setEditData}
                    onChange={(value) => handleInputChange('phoneNumber', value)}
                  />
                  <ProfileField
                    label="Gender"
                    value={isEditing ? editData.gender : userData?.gender}
                    field="gender"
                    isEditing={isEditing}
                    editData={editData}
                    setEditData={setEditData}
                    onChange={(value) => handleInputChange('gender', value)}
                  />
                  <ProfileField
                    label="Age"
                    value={isEditing ? editData.age : userData?.age}
                    field="age"
                    isEditing={isEditing}
                    editData={editData}
                    setEditData={setEditData}
                    onChange={(value) => handleInputChange('age', value)}
                  />
                 
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2 text-white hover:bg-[#0a1f55] rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#091e54' }}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      

      default:
        return null;
    }
  };

  return (
    <div className="flex font-rubik">
      {renderNotification()}
      <div className="w-full p-4">
        {mainComponent()}
      </div>
    </div>
  );
}

export default UserProfile;