import { useState } from 'react';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Bell, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  BarChart3,
  Activity,
  DollarSign,
  UserCheck
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([
    {
      id: 1,
      eventTitle: "Mind Education",
      eventDate: "2025-09-20",
      eventLocation: "AVMCC",
      eventTime: "10:00am - 4:00pm",
      eventDescription: "Come Prepared to be empowered",
      registrations: 45,
      status: 'upcoming'
    },
    {
      id: 2,
      eventTitle: "Youth Leadership Summit",
      eventDate: "2025-10-15",
      eventLocation: "Main Chapel",
      eventTime: "2:00pm - 6:00pm",
      eventDescription: "Developing future leaders",
      registrations: 32,
      status: 'upcoming'
    }
  ]);

  const [formData, setFormData] = useState({
    eventTitle: '',
    eventDate: '',
    eventLocation: '',
    eventTime: '',
    eventDescription: ''
  });

  const dashboardStats = [
    { label: 'Total Events', value: events.length, icon: Calendar, color: 'blue', trend: '+12%' },
    { label: 'Total Registrations', value: '234', icon: Users, color: 'green', trend: '+23%' },
    { label: 'Active Users', value: '156', icon: Activity, color: 'purple', trend: '+8%' },
    { label: 'Revenue', value: '₦921,700', icon: DollarSign, color: 'yellow', trend: '+15%' }
  ];

  const recentActivity = [
    { user: 'Timilehin', action: 'Registered for Mind Education', time: '2 mins ago' },
    { user: 'John Doe', action: 'Completed payment', time: '15 mins ago' },
    { user: 'Jane Smith', action: 'Registered for Leadership Summit', time: '1 hour ago' },
    { user: 'Admin', action: 'Created new event', time: '2 hours ago' }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.eventTitle || !formData.eventDate || !formData.eventLocation || !formData.eventTime || !formData.eventDescription) {
      alert('Please fill in all fields');
      return;
    }

    if (editingEvent) {
      setEvents(events.map(evt => 
        evt.id === editingEvent.id 
          ? { ...formData, id: evt.id, registrations: evt.registrations, status: evt.status }
          : evt
      ));
    } else {
      const newEvent = {
        ...formData,
        id: events.length + 1,
        registrations: 0,
        status: 'upcoming'
      };
      setEvents([...events, newEvent]);
    }
    setShowModal(false);
    setEditingEvent(null);
    setFormData({ eventTitle: '', eventDate: '', eventLocation: '', eventTime: '', eventDescription: '' });
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      eventTitle: event.eventTitle,
      eventDate: event.eventDate,
      eventLocation: event.eventLocation,
      eventTime: event.eventTime,
      eventDescription: event.eventDescription
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(evt => evt.id !== id));
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({ eventTitle: '', eventDate: '', eventLocation: '', eventTime: '', eventDescription: '' });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-xl">
        {/* <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">DLWYC Admin</h1>
          <nav className="space-y-2">
            <button
              onClick={() => setActivePage('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activePage === 'dashboard' ? 'bg-white text-indigo-900' : 'hover:bg-indigo-700'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActivePage('events')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activePage === 'events' ? 'bg-white text-indigo-900' : 'hover:bg-indigo-700'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Events</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-700">
              <Users className="w-5 h-5" />
              <span>Users</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-700">
              <DollarSign className="w-5 h-5" />
              <span>Payments</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {activePage === 'dashboard' ? 'Dashboard Overview' : 'Event Management'}
            </h2>
            <p className="text-gray-600 mt-1">
              {activePage === 'dashboard' 
                ? 'Monitor your platform activity and metrics' 
                : 'Create and manage church events'}
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Bell className="w-5 h-5" />
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">3</span>
          </button>
        </div> */}

        {activePage === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => {
                const Icon = stat.icon;
                const colors = {
                  blue: 'bg-blue-100 text-blue-600',
                  green: 'bg-green-100 text-green-600',
                  purple: 'bg-purple-100 text-purple-600',
                  yellow: 'bg-yellow-100 text-yellow-600'
                };
                return (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-lg ${colors[stat.color]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-green-600 text-sm font-semibold">{stat.trend}</span>
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <UserCheck className="w-8 h-8 mb-3 opacity-80" />
                <h3 className="text-sm font-medium opacity-90">New Users (This Month)</h3>
                <p className="text-3xl font-bold mt-2">47</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <Calendar className="w-8 h-8 mb-3 opacity-80" />
                <h3 className="text-sm font-medium opacity-90">Upcoming Events</h3>
                <p className="text-3xl font-bold mt-2">{events.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
                <h3 className="text-sm font-medium opacity-90">Avg. Attendance</h3>
                <p className="text-3xl font-bold mt-2">89%</p>
              </div>
            </div>
          </div>
        )}

        {/* {activePage === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{events.length} total events</p>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                <Plus className="w-5 h-5" />
                Create New Event
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.eventTitle}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.eventDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {event.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Time:</span> {event.eventTime}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Location:</span> {event.eventLocation}
                      </p>
                      <p className="text-sm text-gray-700">{event.eventDescription}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-gray-700">
                          {event.registrations} Registrations
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>

      {/* {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  name="eventTitle"
                  value={formData.eventTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Time
                  </label>
                  <input
                    type="text"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 10:00am - 4:00pm"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingEvent(null);
                    setFormData({ eventTitle: '', eventDate: '', eventLocation: '', eventTime: '', eventDescription: '' });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}// ==================== MAIN SOLUTION: 7-Character Code Generator ====================























function generateUniqueSevenCharCodes(numberOfPersons) {
  const codes = new Set(); // Use Set to ensure uniqueness
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // 36 possible characters
  const codeLength = 7;
  
  while (codes.size < numberOfPersons) {
    let code = '';
    
    // Generate exactly 7 random characters
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    
    codes.add(code); // Set automatically handles duplicates
  }
  
  return Array.from(codes);
}



// Usage:
const codes = generateUniqueSevenCharCodes(5);
console.log(codes); 
// Output: ['A1B2C3D', 'X9Y8Z7W', 'M4N5P6Q', 'R2S3T4U', 'V7W8X9Y']
console.log(`Generated ${codes.length} unique codes`);

// ==================== OPTIMIZED VERSION ====================
function generateUniqueSevenCharCodesOptimized(numberOfPersons) {
  const codes = new Set();
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  // Check if request is theoretically possible
  const maxPossibleCodes = Math.pow(36, 7); // 36^7 = ~78 billion codes
  if (numberOfPersons > maxPossibleCodes) {
    throw new Error(`Cannot generate ${numberOfPersons} unique codes. Maximum possible: ${maxPossibleCodes}`);
  }
  
  while (codes.size < numberOfPersons) {
    // More efficient string building
    const code = Array.from({ length: 7 }, () => 
      characters[Math.floor(Math.random() * characters.length)]
    ).join('');
    
    codes.add(code);
  }
  
  return Array.from(codes);
}

// ==================== WITH PROGRESS CALLBACK ====================
function generateUniqueSevenCharCodesWithProgress(numberOfPersons, progressCallback) {
  const codes = new Set();
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let lastReportedProgress = 0;
  
  while (codes.size < numberOfPersons) {
    const code = Array.from({ length: 7 }, () => 
      characters[Math.floor(Math.random() * characters.length)]
    ).join('');
    
    codes.add(code);
    
    // Report progress every 10% or every 1000 codes (whichever is smaller)
    const progress = Math.floor((codes.size / numberOfPersons) * 100);
    if (progress > lastReportedProgress && (progress % 10 === 0 || codes.size % 1000 === 0)) {
      progressCallback?.(codes.size, numberOfPersons, progress);
      lastReportedProgress = progress;
    }
  }
  
  return Array.from(codes);
}

// Usage with progress:
const codesWithProgress = generateUniqueSevenCharCodesWithProgress(10000, 
  (current, total, percent) => {
    console.log(`Progress: ${current}/${total} (${percent}%)`);
  }
);

// ==================== ASYNC VERSION (Non-blocking for large numbers) ====================
async function generateUniqueSevenCharCodesAsync(numberOfPersons, batchSize = 1000) {
  const codes = new Set();
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  while (codes.size < numberOfPersons) {
    // Process in batches to avoid blocking the main thread
    const currentBatchSize = Math.min(batchSize, numberOfPersons - codes.size);
    
    for (let i = 0; i < currentBatchSize; i++) {
      const code = Array.from({ length: 7 }, () => 
        characters[Math.floor(Math.random() * characters.length)]
      ).join('');
      
      codes.add(code);
    }
    
    // Yield control back to the event loop
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return Array.from(codes);
}

// Usage:
// const asyncCodes = await generateUniqueSevenCharCodesAsync(50000);

// ==================== WITH EXISTING CODES CHECK ====================
function generateUniqueSevenCharCodesWithExisting(numberOfPersons, existingCodes = []) {
  const codes = new Set(existingCodes); // Start with existing codes
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const originalSize = codes.size;
  
  while (codes.size < originalSize + numberOfPersons) {
    const code = Array.from({ length: 7 }, () => 
      characters[Math.floor(Math.random() * characters.length)]
    ).join('');
    
    codes.add(code);
  }
  
  // Return only the new codes
  return Array.from(codes).slice(originalSize);
}

// Usage:
const existingCodes = ['ABC1234', 'XYZ9876'];
const newCodes = generateUniqueSevenCharCodesWithExisting(5, existingCodes);
console.log(newCodes); // Only returns the 5 new codes, not the existing ones

// ==================== REACT HOOK VERSION ====================
import { useState, useCallback } from 'react';

function useSevenCharCodeGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  
  const generateCodes = useCallback(async (numberOfPersons) => {
    setIsGenerating(true);
    setGeneratedCount(0);
    
    try {
      const codes = new Set();
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      
      while (codes.size < numberOfPersons) {
        const code = Array.from({ length: 7 }, () => 
          characters[Math.floor(Math.random() * characters.length)]
        ).join('');
        
        codes.add(code);
        
        // Update progress
        if (codes.size % 100 === 0 || codes.size === numberOfPersons) {
          setGeneratedCount(codes.size);
          // Yield control for UI updates
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
      
      return Array.from(codes);
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  return { generateCodes, isGenerating, generatedCount };
}

// Usage in React:
// const { generateCodes, isGenerating, generatedCount } = useSevenCharCodeGenerator();
// const handleGenerate = async () => {
//   const codes = await generateCodes(1000);
//   console.log('Generated codes:', codes);
// };

// ==================== PERFORMANCE TESTING ====================
function testCodeGeneration() {
  console.log('Testing 7-character code generation...');
  
  // Test small batch
  console.time('Generate 100 codes');
  const small = generateUniqueSevenCharCodes(100);
  console.timeEnd('Generate 100 codes');
  console.log(`Generated ${small.length} unique codes`);
  
  // Test medium batch
  console.time('Generate 10,000 codes');
  const medium = generateUniqueSevenCharCodes(10000);
  console.timeEnd('Generate 10,000 codes');
  console.log(`Generated ${medium.length} unique codes`);
  
  // Verify uniqueness
  const uniqueCheck = new Set(medium);
  console.log(`Uniqueness check: ${uniqueCheck.size === medium.length ? 'PASS' : 'FAIL'}`);
}

// Run test:
// testCodeGeneration();

// ==================== SIMPLE ONE-LINER VERSION ====================
const generateSevenCharCodes = (count) => 
  Array.from(new Set(Array.from({ length: count * 2 }, () => 
    Math.random().toString(36).substring(2, 9).toUpperCase()
  ))).slice(0, count);





























































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

const handleInputChange = (field, value) => {
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

const ProfileField = ({ label, value, field, type = 'text', isTextarea = false }) => {
  if (isEditing) {
    return (
      <div className="space-y-1">
        <label className="block text-[15px] font-medium text-gray-700">{label}</label>
        {isTextarea ? (
          <textarea
            value={editData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-gray-400 resize-none"
            style={{ '--tw-ring-color': '#091e54' }}
            rows="3"
          />
        ) : (
          <input
            type={type}
            value={editData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-gray-400"
            style={{ '--tw-ring-color': '#091e54' }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="block text-[15px] text-gray-500">{label}</label>
      <p className="text-gray-900 font-medium">{value || 'Not provided'}</p>
    </div>
  );
};

const renderContent = () => {
  switch (activeTab) {
    case 'profile':
      return (
        <div className="space-y-6">
          {/* Email Verification Alert */}
          {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <Mail className="w-3 h-3 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[15px] font-medium text-blue-900 mb-1">Email Verification</h4>
                  <p className="text-[15px] text-blue-700">Your email address has been verified successfully.</p>
                </div>
                <button className="text-blue-400 hover:text-blue-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div> */}

          {/* Profile Overview */}
          <div className="bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Overview</h2>
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#0a1f55] rounded-lg transition-colors duration-200"
                style={{ backgroundColor: '#091e54' }}
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            <div className="flex items-start gap-6 mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                  {(profilePreview || userData.profilePicture) ? (
                    <img
                      src={profilePreview || userData.profilePicture}
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
                    className="absolute -bottom-1 -right-1 w-6 h-6 text-white rounded-full flex items-center justify-center hover:bg-[#0a1f55] transition-colors duration-200"
                    style={{ backgroundColor: '#091e54' }}
                  >
                    <Camera className="w-3 h-3" />
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
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{userData.fullName}</h3>
                <p className="text-gray-600 text-[15px]">{userData.occupation}</p>
                <div className="flex gap-4 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    41
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    124
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    200
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    356
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[15px] text-gray-500 mb-1">Email</label>
                  <p className="text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <label className="block text-[15px] text-gray-500 mb-1">Location</label>
                  <p className="text-gray-900">New York</p>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-white hover:bg-[#0a1f55] rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: '#091e54' }}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      );

    case 'personal':
      return (
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

          <div className="bg-white space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField
                label="Full Name"
                value={userData.fullName}
                field="fullName"
              />
              <ProfileField
                label="Email Address"
                value={userData.email}
                field="email"
                type="email"
              />
              <ProfileField
                label="Phone Number"
                value={userData.phone}
                field="phone"
                type="tel"
              />
              <ProfileField
                label="Date of Birth"
                value={userData.dateOfBirth}
                field="dateOfBirth"
                type="date"
              />
              <ProfileField
                label="Gender"
                value={userData.gender}
                field="gender"
              />
              <ProfileField
                label="Occupation"
                value={userData.occupation}
                field="occupation"
              />
            </div>
            <ProfileField
              label="Address"
              value={userData.address}
              field="address"
            />
            <ProfileField
              label="Bio"
              value={userData.bio}
              field="bio"
              isTextarea={true}
            />

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 text-white hover:bg-[#0a1f55] rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: '#091e54' }}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      );

    case 'password':
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>

          {/* Alert */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                <Shield className="w-3 h-3 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-[15px] text-yellow-700">Your password will expire in 7 days. We strongly recommend changing it now.</p>
              </div>
              <button className="text-yellow-400 hover:text-yellow-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[15px] font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter current password"
                />
                <button className="text-[15px] hover:text-gray-700 mt-1"
                  style={{ color: '#091e54' }}>
                  Forgot your current password?
                </button>
              </div>

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

    case 'documents':
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Documents</h2>

          <div className="bg-white space-y-6">
            {/* Upload Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-[15px] font-medium text-gray-900 mb-3">Upload New Document</h3>
              <div className="flex gap-3">
                <select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-gray-400"
                  style={{ '--tw-ring-color': '#091e54' }}
                >
                  <option value="">Select document type</option>
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <button
                  onClick={() => documentInputRef.current?.click()}
                  disabled={!selectedDocumentType}
                  className="px-4 py-2 text-white rounded-lg hover:bg-[#0a1f55] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                  style={{ backgroundColor: !selectedDocumentType ? undefined : '#091e54' }}
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>
              <input
                ref={documentInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleDocumentUpload}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
              </p>
            </div>

            {/* Documents List */}
            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="text-center py-12 border border-gray-200 rounded-lg">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No documents uploaded</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-[15px] text-gray-500">Uploaded: {doc.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
                        style={{ '&:hover': { backgroundColor: '#e8edf7', color: '#091e54' } }}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      );

    // #### THis Is the sideNav
    default:
      return (
        <div className="space-y-6 border border-red-500">
          <h2 className="text-xl font-semibold text-gray-900">{sidebarItems.find(item => item.id === activeTab)?.label}</h2>
          <div className="bg-white p-8 text-center">
            <p className="text-gray-500">This section is coming soon.</p>
          </div>
        </div>
      );
  }
};

return (
  <div className="min-h-screen bg-gray-50 font-rubik">
    <div className="flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Account Profile</h1>
        </div>

        {/* Profile Summary */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 mb-3">
              {userData.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserCircle className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
            <h3 className="font-medium text-gray-900">{userData.fullName}</h3>
            <div className="flex gap-2 mt-2">
              <span className="w-6 h-6 bg-red-100 text-red-600 rounded text-xs flex items-center justify-center">41</span>
              <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded text-xs flex items-center justify-center">124</span>
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded text-xs flex items-center justify-center">200</span>
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded text-xs flex items-center justify-center">356</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 border border-red-500">
          <ul className="space-y-2 border ">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors duration-200 ${activeTab === item.id
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

        {/* Personal Information Preview */}
        <div className="p-4 border-t border-gray-200">
          <h4 className="text-[15px] font-medium text-gray-900 mb-3">Personal Information</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Email</span>
              <span className="text-right">{userData.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone</span>
              <span className="text-right">{userData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Location</span>
              <span className="text-right">New York</span>
            </div>
          </div>
        </div>


      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  </div>
);













































































//   import { PaystackButton } from 'react-paystack';










// import Male from "/male.png"
// import Female from "/female.png"
// import { Wallet } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useState } from 'react';
// import { useNavigate } from '@tanstack/react-router'





//   function PayStack({userDetails, values, setValues, paymentOption }) {
//      const payment_reference = (new Date()).getTime().toString()
//      const backendURL = import.meta.env.VITE_BACKEND_URL
//      const [userPaymentValues, setUserPaymentValues] = useState({})
//      // const parts = userDetails?.uniqueId?.split('/');
//      // const reference = (parts && parts.length > 2) ? `${parts[1]}${parts[2]}` : '';
//      const amount = paymentOption == 'single' ? 2000 : 400000
//      const [paymentStatus , setPaymentStatus] = useState()
//      const navigate = useNavigate()


//      // When the Paymet Gateway has been closed
//      const handleSuccessAction = async (ref) =>{
//           console.log("Success", ref)

//           try{
//                const response = await axios.get(`https://api.paystack.co/transaction/verify/${ref.reference}`, {
//                     headers: {
//                          "Authorization": `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`
//                     }
//                })
//                const { status, reference, channel, paid_at, id } = await response.data.data
//                setUserPaymentValues({
//                     ...values,
//                     "paymentStatus": status,
//                     "reference": reference,
//                     "modeOfPayment": channel,
//                     "paymentTime": paid_at,
//                     "paymentOption": paymentOption,
//                     "paymentID": id,
//                })

//                console.log("THis is the respnse frpm base: ", response.data.data)
//                console.log("THis is the userPaymentValues Values", userPaymentValues)

//           // // if (status == "abandoned"){
//                     await axios.post(`${backendURL}/api/userRegisteredEvents`, userPaymentValues)
//                     .then(res=>{
//                          console.log("This is the Response From The DB", res)
//                          toast.success(`${res.response.data.message} Please Complete Payment To Register`)
//                          navigate({to: '/userdashboard'})
//                     })
//                     .catch(err=>{
//                          console.log("ERERER", err)
//                          toast.error(`Error: ${err?.response?.data?.errors?.error}`)
//                          navigate({to: '/userdashboard'})
//                     })
//           }
//           catch(err){
//                console.log("This is the errr", err)
//           }
//      }


//      // When the Paymet Gateway has been closed
//      const handleErrorAction = async () =>{
//           const response = await axios.get(`https://api.paystack.co/transaction/verify/${payment_reference}`, {
//                          headers: {
//                          "Authorization": `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`
//                     }
//                })
//                console.log("Response Frm PAYSTACK", response)
//           const { status, reference, channel, paid_at, id } = await response.data.data
//           setValues({
//                     ...values,
//                     "paymentStatus": status,
//                     "reference": reference,
//                     "modeOfPayment": channel,
//                     "paymentTime": paid_at,
//                     "paymentOption": paymentOption,
//                     "paymentID": id,
//           })

//           // if (status == "abandoned"){
//                     await axios.post(`${backendURL}/api/userRegisteredEvents`, values)
//                     .then(res=>{
//                          console.log("This is the Response From The DB", res)
//                          toast.warning(`${res.response.data.message} Please Complete Payment To Register`)
//                          navigate({to: '/userdashboard'})
//                     })
//                     .catch(err=>{
//                          console.log("ERERER", err?.response?.data?.errors?.error)
//                          toast.error(`Error: ${err?.response?.data?.errors?.error}`)
//                          navigate({to: '/userdashboard'})
//                     })
//           // }
//           console.log("Closed The Payment Gateway")
//      }

//      const handleError = (err)=>{
//           console.log("sdsssssssss: ",err)
//      }


//      const componentProps = {
//           publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
//           reference: payment_reference,
//           email: userDetails?.email,
//           amount: amount * 100, 
//           currency: 'NGN',
//           text: paymentStatus == "pending" ? <span class="loader"></span> : 'Proceed To Payment',
//           metadata: {
//                userId: userDetails?.uniqueId,
//                fullName: userDetails?.fullName,
//                paymentOption: paymentOption,
//           },

//           // 
//           onSuccess: (userReference)=> handleSuccessAction(userReference),
//           onClose: (userReference) => handleErrorAction(userReference),
//      }

//     return (
//       <div className="lg:flex grid items-center gap-4">
//           <div className="lg:basis-[50%] basis-[100%] grid place-content-center">

//                     <img src={userDetails?.gender == 'Male' ?  Male : Female} alt="" className='w-[300px]'/>
//           </div>

//          <div className="grid items-center lg:basis-[50%] basis-[100%] gap-4 ">
//          <h2 className="flex items-center text-[20px] py-3"> <Wallet className='mr-3 w-[30px]' /> Your Payment Details</h2>

//           <div className=" space-y-3 ">
//           <p className='text-[14px]'>  Name: <span className='ml-3 font-[500] text-primary-main'> {userDetails?.fullName} </span> </p>
//           <p className='text-[14px]'>  Email: <span className='ml-3 font-[500] text-primary-main'> {userDetails?.email} </span> </p>
//           <p className='text-[14px]'>  Unique ID: <span className='ml-3 font-[500] text-primary-main'> {userDetails?.uniqueId} </span> </p>
//           </div>

//           <div className="mb-4 space-y-3">
//           <p className='text-[14px]'>  Reference ID: <span className='ml-3 font-[500] text-reddish'> {payment_reference} </span> </p>
//           <p className='text-[14px]'>  Amount: <span className='ml-3 font-[500] text-reddish'> {amount} </span> </p>
//           </div>

//         <PaystackButton className='bg-primary-main [padding:var(--spacing-button)] rounded-sm hover:bg-text-header text-white transition ease-in-out delay-20 cursor-pointer' {...componentProps} />
//          </div>
//       </div>
//     );
//   }

//   export default PayStack;























// #:::::::::::::::  GET USER REGISTERED EVENTS :::::::::::::::::#
const {
  data: userRegisteredEvents,
  isLoading: fetchingUserRegisteredEvents,
  isError: errorLoadingUserRegisteredEvents
} = useQuery({
  queryKey: ['userRegisteredEvents', user?.uniqueId],
  queryFn: async () => {
    console.log('Fetching registered events for user:', user?.uniqueId);
    const response = await axios.get(
      `${backendUrl}/api/userRegisteredEvents/${user?.fullName}/${user?.uniqueId}`
    );
    return response.data.data;
  },
  enabled: !!user?.uniqueId, // More specific check
  onError: (error) => {
    console.error("Error fetching user registered events:", error);
  },
  staleTime: 5 * 60 * 1000, // 5 minutes instead of 1 second
  refetchOnWindowFocus: false, // Reduce unnecessary refetches
});

// #:::::::::::::::  GET ALL EVENTS WITH REGISTRATION STATUS :::::::::::::::::#
const {
  data: allEventsWithStatus,
  isLoading: fetchingAllEvents,
  isError: errorLoadingEvents,
} = useQuery({
  queryKey: ['allEventsWithStatus', user?.uniqueId],
  queryFn: async () => {
    console.log('Fetching all events and processing registration status');

    // Fetch all events
    const response = await axios.get(`${backendUrl}/api/admin/events`);
    const allEventsData = response.data.data;

    // Create a Map for O(1) lookup of registration data by eventId
    const registrationMap = new Map();

    if (userRegisteredEvents?.length) {
      userRegisteredEvents.forEach(regEvent => {
        registrationMap.set(regEvent.eventId, {
          isRegistered: true,
          paymentStatus: regEvent.paymentStatus,
          registrationDate: regEvent.registrationDate, // if available
          // Add other registration details as needed
        });
      });
    }

    // Process events with registration status
    const updatedEvents = allEventsData.map((event) => {
      const registrationInfo = registrationMap.get(event._id);

      return {
        ...event,
        // Clean boolean for registration status
        isRegistered: !!registrationInfo,
        // Specific payment status (null if not registered)
        paymentStatus: registrationInfo?.paymentStatus || null,
        // Additional registration info if needed
        registrationInfo: registrationInfo || null
      };
    });

    console.log({
      "Total Events": allEventsData.length,
      "Registered Events": userRegisteredEvents?.length || 0,
      "Updated Events Sample": updatedEvents.slice(0, 2) // Log first 2 for debugging
    });

    return updatedEvents;
  },
  // Only run when user exists and user registered events are loaded
  enabled: !!user?.uniqueId && !fetchingUserRegisteredEvents,
  onError: (error) => {
    console.error('Failed to load events:', error);
    // toast.error('Failed to load events');
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
});

// #:::::::::::::::  USER CHANGE EFFECT :::::::::::::::::#
useEffect(() => {
  if (user?.uniqueId) {
    console.log("User changed, invalidating queries for:", user.uniqueId);

    // Invalidate queries with correct keys
    queryClient.invalidateQueries({
      queryKey: ['userRegisteredEvents', user.uniqueId]
    });
    queryClient.invalidateQueries({
      queryKey: ['allEventsWithStatus', user.uniqueId]
    });
  }
}, [user?.uniqueId, queryClient]); // Add queryClient to dependencies

// #:::::::::::::::  HELPER FUNCTIONS :::::::::::::::::#

// Helper function to check if user is registered for a specific event
const isUserRegisteredForEvent = (eventId) => {
  if (!allEventsWithStatus) return false;

  const event = allEventsWithStatus.find(event => event._id === eventId);
  return event?.isRegistered || false;
};

// Helper function to get registration status for display
const getRegistrationDisplayInfo = (event) => {
  if (!event.isRegistered) {
    return {
      text: "Not Registered",
      className: "text-red-500",
      status: "not-registered"
    };
  }

  // Handle different payment statuses
  switch (event.paymentStatus) {
    case "success":
    case "completed":
      return {
        text: "Registered",
        className: "text-green-500",
        status: "registered-paid"
      };
    case "pending":
      return {
        text: "Registration Pending",
        className: "text-yellow-500",
        status: "registered-pending"
      };
    case "failed":
      return {
        text: "Payment Failed",
        className: "text-red-500",
        status: "registered-failed"
      };
    default:
      return {
        text: "Registered",
        className: "text-blue-500",
        status: "registered-unknown"
      };
  }
};

// #:::::::::::::::  UPDATED UI COMPONENT USAGE :::::::::::::::::#

// In your JSX component:
const EventCard = ({ event, index }) => {
  const registrationInfo = getRegistrationDisplayInfo(event);

  return (
    <div
      key={index}
      className="flex border justify-center space-y-2 flex-col rounded-[5px] px-[20px] py-[15px] bg-white border-[#e8e8e8]"
    >
      {console.log("Event Registration Info:", {
        eventId: event._id,
        isRegistered: event.isRegistered,
        paymentStatus: event.paymentStatus,
        displayInfo: registrationInfo
      })}

      <div className="flex justify-between items-center">
        <h3 className="text-rubik text-[#1E293B] text-[17px] font-[500] flex items-center gap-2">
          {event.eventTitle}
        </h3>

        <p className="text-rubik text-[#1E293B] text-[13px] flex items-center">
          <span className={registrationInfo.className}>
            {registrationInfo.text}
          </span>
        </p>
      </div>

      {/* Optional: Show additional registration details */}
      {event.registrationInfo && (
        <div className="text-[15px] text-gray-600">
          <p>Status: {event.paymentStatus}</p>
          {event.registrationInfo.registrationDate && (
            <p>Registered: {new Date(event.registrationInfo.registrationDate).toLocaleDateString()}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Usage in your main component:
const EventsList = () => {
  // ... your query hooks here ...

  if (fetchingAllEvents) {
    return <div>Loading events...</div>;
  }

  if (errorLoadingEvents) {
    return <div>Error loading events</div>;
  }

  return (
    <div className="space-y-4">
      {allEventsWithStatus?.map((event, index) => (
        <EventCard key={event._id || index} event={event} index={index} />
      ))}
    </div>
  );
};

// Export the data and helper functions
export {
  allEventsWithStatus,
  fetchingAllEvents,
  errorLoadingEvents,
  userRegisteredEvents,
  fetchingUserRegisteredEvents,
  errorLoadingUserRegisteredEvents,
  isUserRegisteredForEvent,
  getRegistrationDisplayInfo
};




















// #:::::::::::::::  GET USER REGISTERED EVENTS :::::::::::::::::#
const {
  data: userRegisteredEvents,
  isLoading: fetchingUserRegisteredEvents,
  isError: errorLoadingUserRegisteredEvents
} = useQuery({
  queryKey: ['userRegisteredEvents', user?.uniqueId],
  queryFn: async () => {
    console.log('Fetching registered events for user:', user?.uniqueId);
    const response = await axios.get(
      `${backendUrl}/api/userRegisteredEvents/${user?.fullName}/${user?.uniqueId}`
    );
    return response.data.data;
  },
  enabled: !!user?.uniqueId, // More specific check
  onError: (error) => {
    console.error("Error fetching user registered events:", error);
  },
  staleTime: 5 * 60 * 1000, // 5 minutes instead of 1 second
  refetchOnWindowFocus: false, // Reduce unnecessary refetches
});

// #:::::::::::::::  GET ALL EVENTS WITH REGISTRATION STATUS :::::::::::::::::#
const {
  data: allEventsWithStatus,
  isLoading: fetchingAllEvents,
  isError: errorLoadingEvents,
} = useQuery({
  queryKey: ['allEventsWithStatus', user?.uniqueId],
  queryFn: async () => {
    console.log('Fetching all events and processing registration status');

    // Fetch all events
    const response = await axios.get(`${backendUrl}/api/admin/events`);
    const allEventsData = response.data.data;

    // Create a Map for O(1) lookup of registration data by eventId
    const registrationMap = new Map();

    if (userRegisteredEvents?.length) {
      userRegisteredEvents.forEach(regEvent => {
        registrationMap.set(regEvent.eventId, {
          isRegistered: true,
          paymentStatus: regEvent.paymentStatus,
          registrationDate: regEvent.registrationDate, // if available
          // Add other registration details as needed
        });
      });
    }

    // Process events with registration status
    const updatedEvents = allEventsData.map((event) => {
      const registrationInfo = registrationMap.get(event._id);

      return {
        ...event,
        // Clean boolean for registration status
        isRegistered: !!registrationInfo,
        // Specific payment status (null if not registered)
        paymentStatus: registrationInfo?.paymentStatus || null,
        // Additional registration info if needed
        registrationInfo: registrationInfo || null
      };
    });

    console.log({
      "Total Events": allEventsData.length,
      "Registered Events": userRegisteredEvents?.length || 0,
      "Updated Events Sample": updatedEvents.slice(0, 2) // Log first 2 for debugging
    });

    return updatedEvents;
  },
  // Only run when user exists and user registered events are loaded
  enabled: !!user?.uniqueId && !fetchingUserRegisteredEvents,
  onError: (error) => {
    console.error('Failed to load events:', error);
    // toast.error('Failed to load events');
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
});

// #:::::::::::::::  USER CHANGE EFFECT :::::::::::::::::#
useEffect(() => {
  if (user?.uniqueId) {
    console.log("User changed, invalidating queries for:", user.uniqueId);

    // Invalidate queries with correct keys
    queryClient.invalidateQueries({
      queryKey: ['userRegisteredEvents', user.uniqueId]
    });
    queryClient.invalidateQueries({
      queryKey: ['allEventsWithStatus', user.uniqueId]
    });
  }
}, [user?.uniqueId, queryClient]); // Add queryClient to dependencies

// #:::::::::::::::  HELPER FUNCTIONS :::::::::::::::::#

// Helper function to check if user is registered for a specific event
const isUserRegisteredForEvent = (eventId) => {
  if (!allEventsWithStatus) return false;

  const event = allEventsWithStatus.find(event => event._id === eventId);
  return event?.isRegistered || false;
};

// Helper function to get registration status for display
const getRegistrationDisplayInfo = (event) => {
  if (!event.isRegistered) {
    return {
      text: "Not Registered",
      className: "text-red-500",
      status: "not-registered"
    };
  }

  // Handle different payment statuses
  switch (event.paymentStatus) {
    case "success":
    case "completed":
      return {
        text: "Registered",
        className: "text-green-500",
        status: "registered-paid"
      };
    case "pending":
      return {
        text: "Registration Pending",
        className: "text-yellow-500",
        status: "registered-pending"
      };
    case "failed":
      return {
        text: "Payment Failed",
        className: "text-red-500",
        status: "registered-failed"
      };
    default:
      return {
        text: "Registered",
        className: "text-blue-500",
        status: "registered-unknown"
      };
  }
};

// Export the data and helper functions
export {
  allEventsWithStatus,
  fetchingAllEvents,
  errorLoadingEvents,
  userRegisteredEvents,
  fetchingUserRegisteredEvents,
  errorLoadingUserRegisteredEvents,
  isUserRegisteredForEvent,
  getRegistrationDisplayInfo
};













































import { useState, useEffect } from "react";
import Logo from "../../assets/main_logo.svg";
import dlw from "../../assets/registrationpage/dlw.jpeg";
import axios from "axios";
import Churches from "../../data/churches";
import Input from "../../components/Inputs/Inputs";
import {
  ageOptions,
  genderOptions,
  archdeaconryOptions,
  camperTypeOptions,
  denominationOptions,
} from "../../data/Inputs";
import { HandleData } from "../../utils/functions";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert/Alert";

// Default values shown

export default function Registration() {
  // ## Set Loading State
  const [loadingState, setLoadingState] = useState(false);

  // ## This it to get the values of the inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [archdeaconry, setArchdeaconry] = useState("");
  const [parish, setParish] = useState("");
  const [inputError, setInputError] = useState({});
  const [generalError, setGeneralError] = useState({});
  const navigate = useNavigate();
  const [camperType, setCamperType] = useState("");
  const [denomination, setDenomination] = useState(null);
  const [churchList, setChurchList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [disable, setDisable] = useState();
  const [registrationStatus, setRegistrationStatus] = useState(true);
  const [paymentOption, setPaymentOption] = useState("Single");
  // const [noOfUnpaidCampers, setNoOfUnpaidCampers] = useState([]);
  const [noOfUnpaidCampersOption, setNoOfUnpaidCampersOption] = useState([]);
  const [noOfCampersToPayFor, setNoOfCampersToPayFor] = useState("");
  const [alert, setAlert] = useState("");

  const userInput = {
    fullName,
    email,
    phoneNumber,
    age,
    gender,
    archdeaconry,
    parish,
    camperType,
    denomination,
    paymentOption,
    noOfUnpaidCampersOption,
    noOfCampersToPayFor,
  };

  // ## Handle Input Changes
  //   ## Submit Form Data

  setTimeout(() => {
    setAlert(false);
  }, 6000);

  window.localStorage.setItem("paymentOption", paymentOption);

  const submitForm = async (e) => {
    setLoadingState(true);
    e.preventDefault();
    window.localStorage.setItem("email", userInput.email);
    try {
      const { data } = await axios.post(
        "https://api.dlwyouth.org/api/registration",
        // "http://localhost:5000/api/registration",
        userInput
      );
      if (data.message === "Registration Successful") {
        // window.localStorage.setItem("paymentUrl", data.paymentUrl);
        // window.localStorage.setItem("ref", data.reference);
        navigate("/registration/verify");
      } else {
        setGeneralError({ message: 'Registration Failed' })
        setRegistrationStatus(false);
        console.log('first')
      }
    } catch (err) {
      setLoadingState(false);
      if (err.response && err.response.data.message === "Input Errors") {
        setInputError(err.response.data.errors);
        console.log(err.response.data.errors)
        console.log('second')
      }
      else {
        setGeneralError({ message: "Network Error" });
        console.log('fourth')
        setAlert(true);
      }
      // console.log(err.response.data.errors);
      console.log('gend')
      // console.log(err.response.data.errors);
    }
  };

  // console.log(loadingState)

  // ## Handle Dropdown Changes
  useEffect(() => {
    setDisable(HandleData(userInput));
  }, [userInput]);

  useEffect(() => {
    //   ## Filter Parishes by Archdeaconry
    if (archdeaconry) {
      const handleArchdeaconryFilter = Churches.filter(
        (item) => item.archdeaconry === archdeaconry
      );
      const churches = handleArchdeaconryFilter.flatMap((churches) =>
        churches.churches.map((church) => ({
          value: church.name,
          label: church.name,
        }))
      );
      setChurchList(churches);
      setSelectedOption(null);
      setParish(null);
    } else {
      setChurchList([]);
      setSelectedOption(null);
      setParish(null);
    }
  }, [archdeaconry]);

  // ## Handle ArchdeaconryType
  useEffect(() => {
    if (denomination === "Anglican" && selectedOption) {
      setParish(selectedOption.value);
    } else if (denomination === "Non-Anglican") {
      setParish(null);
    } else {
      setParish(null);
    }
  }, [selectedOption, denomination]);

  // ## Handle Error Removal
  const removeError = (e) => {
    setInputError({ ...inputError, [e.target.name]: "" });
  };

  // # Get the payment type status
  const getPaymentModeValue = async (e) => {
    const paymentOptions = e.target.value;
    setPaymentOption(paymentOptions);
    if (paymentOptions === "Multiple") {
      const campers = await axios.get(
        `https://api.dlwyouth.org/api/unPaidCampers?parish=` + parish
        // `http://localhost:5000/api/unPaidCampers?parish=` + parish
      );
      const camperList = campers.data.map((camper) => ({
        label: camper.fullName,
        value: camper.uniqueID,
        email: camper.email
      }));
      setNoOfUnpaidCampers(camperList);
    } else {
      setNoOfUnpaidCampers([]);
      setNoOfUnpaidCampersOption("");
    }
  };

  useEffect(() => {
    setNoOfCampersToPayFor(noOfUnpaidCampersOption.length);
  }, [noOfUnpaidCampersOption]);

  // ## Get the Number OF Unpaid Campers

  return (
    <div className="grid lg:p-3 p-0 relative h-full lg:grid-cols-2 lg:place-content-center font-rubik  ">
      <div className="rounded-lg flex  h-full flex-col space-y-2 lg:p-5 p-2 lg:basis-[50%] basis-full lg:justify-center relative  ">
        <div className="justify-between items-center lg:flex grid space-y-3">
          <a href={'/'}>
            <img className="w-[250px] top-[10px]" src={Logo} alt="Logo" />
          </a>
        </div>

        <div className="lg:text-[17px] font-normal font-rubik-moonrock text-primary-main flex justify-between">
          <h1>
            2024 <span className="text-red-600">Camp</span> Registration{" "}
          </h1>
          <p className="text-red-500 font-rubik-moonrock">
            {" "}
            <span className="text-primary-main ">Note:</span> All Input Fields
            Are To Be Filled
          </p>
        </div>

        <form method="post" className="space-y-5 font-rubik ">
          <div className="space-y-3 ">
            {/* FirstName */}
            <div className="text-[15px] space-y-1">
              <Input
                // required
                error={inputError}
                // value={}
                removeError={removeError}
                onInput={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="Enter Full Name"
                name="fullName"
                label="Full Name"
              />
            </div>
            {/* FirstName */}

            {/* Email and Phone Number */}
            <div className="flex lg:flex-row flex-col lg:space-x-2 text space-y-3 lg:space-y-0">
              <Input
                // required
                error={inputError}
                // value={''}
                removeError={removeError}
                onInput={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter Email"
                name="email"
                label="Email"
                basis
              />
              <Input
                // required
                error={inputError}
                // value={''}
                removeError={removeError}
                onInput={(e) => setPhoneNumber(e.target.value)}
                type="text"
                placeholder="Enter Phone Number"
                name="phoneNumber"
                label="Phone Number"
                basis
              />
            </div>
            {/* Email and Phone Number */}

            {/* Age and Gender */}
            <div className="flex lg:flex-row flex-col lg:space-x-2 text space-y-3 lg:space-y-0">
              <Input
                // required
                error={inputError}
                // value={''}
                removeError={removeError}
                onInput={(e) => setAge(e.target.value)}
                name="age"
                label="Age"
                basis
                options={ageOptions}
              />
              <Input
                // required
                error={inputError}
                // value={''}
                removeError={removeError}
                onInput={(e) => setGender(e.target.value)}
                name="gender"
                label="Gender"
                basis
                options={genderOptions}
              />
            </div>
            {/* Age and Gender */}

            {/* Camper Type and Anglican Member */}
            <div className="flex lg:flex-row flex-col lg:space-x-2 text space-y-3 lg:space-y-0">
              <Input
                // required
                error={inputError}
                // value={''}
                removeError={removeError}
                onInput={(e) => setCamperType(e.target.value)}
                name="camperType"
                label="Camper Type"
                basis
                options={camperTypeOptions}
              />
              <Input
                // required
                error={inputError}
                // value={''}
                removeError={removeError}
                onInput={(e) => setDenomination(e.target.value)}
                name="denomination"
                label="Denomination"
                basis
                options={denominationOptions}
              />
            </div>
            {/* Camper Type and Anglican Member */}

            {/* Archdeaconry and Parish */}
            {denomination === null ||
              denomination === "" ||
              denomination === "Non-Anglican" ? (
              ""
            ) : (
              <div className="flex lg:flex-row flex-col lg:space-x-2 text space-y-3 lg:space-y-0">
                <Input
                  // required
                  error={inputError}
                  // value={}
                  removeError={removeError}
                  onInput={(e) => setArchdeaconry(e.target.value)}
                  name="archdeaconry"
                  label="Archdeaconry"
                  basis
                  options={archdeaconryOptions}
                  denomination={denomination}
                />
                <Input
                  // required
                  error={inputError}
                  // value={}
                  removeError={removeError}
                  onChange={setSelectedOption}
                  name="parish"
                  label="Parish"
                  basis
                  options={churchList}
                  value={selectedOption}
                  denomination={denomination}
                />
              </div>
            )}
            {/* Archdeaconry and Parish */}

            {/* Transaction/Payment ID: */}
            {denomination === null ||
              denomination === "" ||
              denomination === "Non-Anglican" ? (
              ""
            ) : denomination === "Anglican" && parish == null ? (
              ""
            ) : (
              <div className="lg:flex grid items-center border">
                <label className="text-faint-blue font-normal tracking-[0.6px]">
                  Payment Mode<span className="text-[red]">*</span>
                </label>
                <div className="flex lg:flex-row flex-col lg:gap-10 gap-4 p-3">
                  <div className="flex items-center space-x-3">
                    <label htmlFor="single">Single:</label>
                    <input
                      type="radio"
                      name="paymentOptions"
                      value={"Single"}
                      id="single"
                      onClick={getPaymentModeValue}
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <label htmlFor="multiple">Multiple:</label>
                    <input
                      type="radio"
                      name="paymentOptions"
                      value={"Multiple"}
                      id="multiple"
                      readOnly
                      onClick={getPaymentModeValue}
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <label htmlFor="paidByChurch">Church Sponsored:</label>
                    <input
                      type="radio"
                      name="paymentOptions"
                      value={"Church Sponsored"}
                      id="paidByChurch"
                      onClick={getPaymentModeValue}
                    />
                  </div>
                </div>
              </div>
            )}


            {/* Number Of Campers to pay for &7 Choices */}

            {parish === "" || parish === null ? (
              ""
            ) : (
              <>
                {paymentOption === "Multiple" ? (
                  <div className="flex lg:flex-row flex-col lg:space-x-2 text space-y-3 lg:space-y-0">
                    <Input
                      required
                      error={inputError}
                      value={noOfCampersToPayFor}
                      removeError={removeError}
                      name="noOfCampersToPayFor"
                      label="Number Of Campers To Pay For"
                      basis
                      type={"number"}
                      readOnly
                    />
                    <Input
                      error={inputError}
                      // value={}
                      removeError={removeError}
                      onChange={setNoOfUnpaidCampersOption}
                      name="noOfUnpaidCampers"
                      label="List Of Unpaid Campers"
                      basis
                      options={noOfUnpaidCampers}
                      value={noOfUnpaidCampersOption}
                    // denomination={denomination}
                    />
                  </div>
                ) : (
                  ""
                )}
              </>
            )}
            {/* Number Of Campers to pay for &7 Choices */}

            {/* Registration */}
            <div className="flex gap-3 text-center justify-center">
              <p className="text-faint-blue">
                By Registering, you are indicating that you have <br /> Read and
                agreed to the{" "}
                <a href="" className="text-red-500 underline">
                  Rules & Regulations
                </a>
                for the camp
              </p>
            </div>
            {/* Registration */}
          </div>

          <div className="mt-5 lg:flex gap-3 lg:space-y-0 space-y-3 relative">
            {disable === true ? (
              <button
                className={`w-full outline-none ring-[0.3px] ring-text-primary bg-gray-200 transition-all rounded-md p-3 text-primary-main text-[15px] cursor-not-allowed `}
                disabled
              >
                Register
              </button>
            ) : (
              <button
                type="submit"
                onClick={submitForm}
                className={`w-full outline-none ring-[0.3px] ring-text-primary ${loadingState ? "bg-[#85858580] cursor-not-allowed" : "bg-blue-900 hover:bg-reddish"
                  } transition-all rounded-md p-3 text-white text-[15px] `}
              >
                {loadingState ? (
                  'Registering...'
                ) : (
                  " Register "
                )}
              </button>
            )}
            <a
              href="/"
              className="rounded-[5px] bg-reddish text-white lg:w-full w-full p-3 grid place-content-center hover:bg-blue-900 transition-all"
            >
              Back
            </a>
          </div>
        </form>
      </div>

      <div className="lg:flex fixed lg:right-0 w-[50%] h-full flex-col hidden  basis-[50%] space-y-2 justify-center items-center">
        <div className="flex items-center reg_image ">
          <img className="w-[full]" src={dlw} alt="" />
        </div>

        <div className="text-center p-3 space-y-3 basis-[20%]">
          <h1 className="font-medium tracking-wider uppercase text-red-700">
            Romans 16:26
          </h1>
          <p className="text-faint-blue font-normal">
            “ But now is made manifest, and by the scriptures of the <br />{" "}
            prophets, according to the commandment of the everlasting <br />
            God, made known to all nations for the obedience of faith: “
          </p>
        </div>
      </div>

      {/* Notification */}
      <>
        {/* Global notification live region, render this permanently at the end of the document */}
        {registrationStatus === false ? (
          <Alert
            status={alert}
            header={"Regitration Failed!"}
            text={"Please Try Registering Again."}
          />
        ) : (
          ""
        )}
        {generalError.message === "Registration Failed" ? (
          <Alert
            status={alert}
            header={"Registration Failed!"}
            text={
              "Error Trying to Register This User. Please Reach out to the Technical Unit"
            }
          />
        ) : (
          ""
        )}
        {generalError.message === "Network Error" ? (
          <Alert
            status={alert}
            header={"Error Occured!"}
            text={
              "Error Connecting with the server. Please Reach out to the Technical Unit"
            }
          />
        ) : (
          ""
        )}
      </>
      {/* Notification */}
    </div>
  );
}
