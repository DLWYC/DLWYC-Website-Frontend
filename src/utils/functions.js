const HandleData = (e) => {
  if (
    e.fullName !== "" &&
    e.email !== "" &&
    e.phoneNumber !== "" &&
    e.age !== "" &&
    e.gender !== "" &&
    e.camperType !== "" &&
    e.denomination === "Anglican" &&
    e.archdeaconry !== "" &&
    e.parish !== null &&
    e.paymentOption !== ""
  ) {
    return false;
  } else if (
    e.fullName !== "" &&
    e.email !== "" &&
    e.phoneNumber !== "" &&
    e.age !== "" &&
    e.gender !== "" &&
    e.denomination !== "" &&
    e.camperType !== "" &&
    e.denomination === "Non-Anglican"
  ) {
    return false;
  } else {
    return true;
  }
};


const handleEdit = () => {
  setIsEditing(true);
  setEditData({ ...userData });
  setProfilePreview(userData.profilePicture);
};

const handleCancel = () => {
  setIsEditing(false);
  setEditData({ ...userData });
  setProfilePreview(userData.profilePicture);
};

const handleSave = () => {
  setUserData({ ...editData });
  if (profilePreview) {
    setUserData(prev => ({ ...prev, profilePicture: profilePreview }));
  }
  setIsEditing(false);
};

const handleInputChange = (field, value, setEditData) => {
  setEditData(prev => ({
    ...prev,
    [field]: value
  }));
};

const handlePasswordChange = (field, value) => {
  setPasswordData(prev => ({
    ...prev,
    [field]: value
  }));
};

const handleProfilePictureChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

const handleDocumentUpload = (event) => {
  const file = event.target.files[0];
  if (file && selectedDocumentType) {
    const newDocument = {
      id: Date.now(),
      name: selectedDocumentType,
      file: file,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [...prev, newDocument]);
    setSelectedDocumentType('');
    documentInputRef.current.value = '';
  }
};

const handleDeleteDocument = (id) => {
  setDocuments(prev => prev.filter(doc => doc.id !== id));
};




export { HandleData, handleEdit, handleCancel, handleSave, handleInputChange, handlePasswordChange, handleProfilePictureChange, handleDocumentUpload, handleDeleteDocument };
