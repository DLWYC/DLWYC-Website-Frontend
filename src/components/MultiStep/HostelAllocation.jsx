import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Home, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from "../../lib/AuthContext"
import UserProfileImage from '@/components/UserProfileImage/UserProfileImage'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'react-toastify';

// API Configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Constants
const ALLOCATION_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  PENDING: 'PENDING',
  ALLOCATED: 'ALLOCATED',
  CONFIRMED: 'CONFIRMED',
  EXPIRED: 'EXPIRED',
};

// Utility Functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Access Denied Component
const AccessDenied = React.memo(({ message, onGoBack }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-8 max-w-md w-full">
      <div className="flex flex-col items-center text-center">
        <XCircle className="w-16 h-16 text-red-600 mb-4" />
        <h2 className="text-2xl font-bold text-red-800 mb-3">Access Denied</h2>
        <p className="text-red-700 mb-6">{message}</p>
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Go Back to Dashboard
        </button>
      </div>
    </div>
  </div>
));

AccessDenied.displayName = 'AccessDenied';

// Step Indicator Component
const StepIndicator = React.memo(({ steps, currentStep }) => (
  <div className="flex items-center justify-center mb-8">
    {steps.map((step, index) => (
      <React.Fragment key={index}>
        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
            index < currentStep ? 'bg-green-500 text-white' :
            index === currentStep ? 'bg-primary-main text-white' :
            'bg-gray-300 text-gray-600'
          }`}>
            {index < currentStep ? <CheckCircle className="w-6 h-6" /> : index + 1}
          </div>
          <p className={`text-sm mt-2 font-medium ${
            index === currentStep ? 'text-primary-main' : 'text-gray-600'
          }`}>
            {step.title}
          </p>
        </div>
        {index < steps.length - 1 && (
          <div className={`w-16 h-1 mx-2 mb-6 transition-all ${
            index < currentStep ? 'bg-green-500' : 'bg-gray-300'
          }`} />
        )}
      </React.Fragment>
    ))}
  </div>
));

StepIndicator.displayName = 'StepIndicator';

// Gender Confirmation Component
const GenderConfirmation = React.memo(({ userGender, loading }) => {
  const genderIcon = userGender?.toLowerCase() === 'male' ? '👨' : '👩';

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Your Gender</h2>
         <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-800 text-sm">
                Your gender is taken from your profile and cannot be changed here. If this is incorrect, please contact the ICT department.
              </p>
            </div>
      </div>

      <div className="max-w-md mx-auto">
        <div className={`relative p-8 rounded-xl border-2 bg-primary-main bg-opacity-10 border-opacity-50`}>
          <div className="text-6xl mb-4 text-center">{genderIcon}</div>
          <div className="text-center">
            <h3 className="font-bold text-2xl text-white mb-2">{userGender}</h3>
            <p className="text-white">
              You will be shown {userGender?.toLowerCase()} hostels only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

GenderConfirmation.displayName = 'GenderConfirmation';

// Loading Spinner Component
const LoadingSpinner = React.memo(({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
    <p className="text-gray-600">{message}</p>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Hostel Card Component
const HostelCard = React.memo(({ hostel }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <h3 className="font-bold text-gray-800 text-lg">{hostel.name}</h3>
        <p className="text-sm text-gray-600 mt-1">Room Number: {hostel.hostel_id}</p>
        <p className="text-sm text-red-600 mt-1">Floor: {hostel.floor}</p>
        {hostel.building_block && (
          <p className="text-sm text-gray-500 mt-1">Building: {hostel.building_block}</p>
        )}
        {hostel.facilities?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {hostel.facilities.map((facility, idx) => (
              <span key={idx} className="text-xs bg-indigo-100 text-primary-main px-2 py-1 rounded">
                {facility}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="text-right ml-4">
        <p className="text-sm text-gray-500">Available</p>
        <p className="text-2xl font-bold text-primary-main">{hostel.available_spaces}</p>
        <p className="text-xs text-gray-400">of {hostel.total_capacity}</p>
      </div>
    </div>
  </div>
));

HostelCard.displayName = 'HostelCard';

// Hostels Display Component
const HostelsDisplay = React.memo(({ availableHostels, loading }) => {
  if (loading) {
    return <LoadingSpinner message="Loading available hostels..." />;
  }

  if (!availableHostels || availableHostels.hostels?.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
        <p className="text-gray-600">No hostels available at the moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Available Hostels</h2>
        <p className="text-red-600 text-sm flex items-center justify-center mt-2 gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> A hostel will be randomly assigned to you from the available options based on space availability.
        </p>
      </div>

      <div className="bg-primary-main border border-indigo-200 text-white rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm mb-1">Total Hostels Available</p>
            <p className="text-3xl font-bold">{availableHostels.available_count}</p>
          </div>
          <div>
            <p className="text-sm mb-1">Total Spaces</p>
            <p className="text-3xl font-bold">{availableHostels.total_spaces}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[230px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 justify-center">
          {availableHostels.hostels.map((hostel) => (
            <HostelCard key={hostel.hostel_id} hostel={hostel} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
});

HostelsDisplay.displayName = 'HostelsDisplay';

// Allocation Result Component
const AllocationResult = React.memo(({ allocation, loading }) => {
  if (loading) {
    return <LoadingSpinner message="Processing your allocation..." />;
  }

  if (!allocation) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No allocation data available</p>
      </div>
    );
  }

  const isConfirmed = allocation.status === 'CONFIRMED';
  const isPending = allocation.status === 'PENDING_CONFIRMATION';

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          {isConfirmed ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <Clock className="w-10 h-10 text-yellow-600" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {isConfirmed ? 'Allocation Confirmed!' : 'Hostel Allocated'}
        </h2>
        <p className="text-gray-600">
          {isConfirmed 
            ? 'Your hostel has been successfully confirmed' 
            : 'Please review and confirm your allocation'}
        </p>
      </div>

      <div className="bg-primary-main rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Home className="w-8 h-8" />
          <h3 className="text-2xl font-bold">{allocation.hostel_name}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-indigo-200 text-sm">Allocation ID</p>
            <p className="text-sm font-semibold">{allocation.allocation_id}</p>
          </div>
          <div>
            <p className="text-indigo-200 text-sm">Hostel ID</p>
            <p className="font-mono text-sm font-semibold">{allocation.hostel_id}</p>
          </div>
          {allocation.building_block && (
            <div>
              <p className="text-indigo-200 text-sm">Building</p>
              <p className="font-semibold">{allocation.building_block}</p>
            </div>
          )}
          <div>
            <p className="text-indigo-200 text-sm">Allocated At</p>
            <p className="text-sm font-semibold">{formatDate(allocation.allocated_at)}</p>
          </div>
        </div>
      </div>

      {isPending && allocation.expires_at && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-800 font-semibold mb-1">⏰ Time Sensitive</p>
              <p className="text-yellow-700 text-sm mb-2">
                You have 5 hours to confirm this allocation. After that, it will expire and the space will be released.
              </p>
              <p className="text-yellow-800 text-sm font-medium">
                Expires: {formatDate(allocation.expires_at)}
              </p>
            </div>
          </div>
        </div>
      )}

      {isConfirmed && (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-semibold mb-1">✓ Confirmed</p>
              <p className="text-green-700 text-sm">
                Your hostel allocation has been confirmed. Please check your email for further instructions and next steps.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

AllocationResult.displayName = 'AllocationResult';

// Error Alert Component
const ErrorAlert = React.memo(({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-semibold text-red-800">Error</p>
        <p className="text-red-700">{error}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-600 hover:text-red-800">
          <XCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
});

ErrorAlert.displayName = 'ErrorAlert';

// Main Dashboard Component
const HostelAllocationDashboard = () => {
  const { userData, userRegisteredEvents } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  
  const [user, setUser] = useState(userData);
  const [allocation, setAllocation] = useState(null);
  const [availableHostels, setAvailableHostels] = useState(null);

  // Check if user has paid for any event
  useEffect(() => {
    const checkEventRegistration = () => {
      setCheckingAccess(true);
      
      // Check if user has at least one successful payment
      const hasSuccessfulPayment = userRegisteredEvents?.some(
        event => event.paymentStatus === 'success'
      );

      if (!hasSuccessfulPayment) {
        setHasAccess(false);
        setCheckingAccess(false);
        return;
      }

      // Check if user has gender in profile
      if (!userData?.gender) {
        setHasAccess(false);
        setError('Gender information is missing from your profile. Please contact support.');
        setCheckingAccess(false);
        return;
      }

      setHasAccess(true);
      setCheckingAccess(false);
    };

    checkEventRegistration();
  }, [userData, userRegisteredEvents]);

  const allocationSuccess = () => {
    toast.success("Hostel allocation confirmed successfully!");
    navigate({ to: '/userdashboard' });
  };

  // API Calls
  const checkExistingAllocation = useCallback(async () => {
    if (!hasAccess) return;
    
    setLoading(true);
    try {
      const { data } = await api.get(`/api/allocations/getAllocationStatus/${user.uniqueId}`);
      
      if (data.success && data.status !== ALLOCATION_STATUS.NOT_STARTED) {
        setUser(prev => ({ ...prev, allocationStatus: data.status }));
        
        if (data.allocation) {
          setAllocation({
            allocation_id: data.allocation.allocation_id,
            hostel_id: data.allocation.hostel.hostel_id,
            hostel_name: data.allocation.hostel.name,
            building_block: data.allocation.hostel.building_block,
            allocated_at: data.allocation.allocated_at,
            expires_at: data.allocation.expires_at,
            confirmed_at: data.allocation.confirmed_at,
            status: data.allocation.status === 'CONFIRMED' ? 'CONFIRMED' : 'PENDING_CONFIRMATION'
          });
          setCurrentStep(2);
        }
      }
    } catch (err) {
      console.error('Error checking allocation:', err);
      setError(err.response?.data?.error || 'Failed to check allocation status');
    } finally {
      setLoading(false);
    }
  }, [user?.uniqueId, hasAccess]);

  const fetchAvailableHostels = useCallback(async () => {
    if (!hasAccess || !user?.gender) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the gender from user profile - no user selection allowed
      const { data } = await api.get(`/api/hostels/getAvailableHostels/${user.gender}`);
      
      if (data.success) {
        setAvailableHostels(data);
        setCurrentStep(1);
      } else {
        setError(data.error || 'Failed to fetch available hostels');
      }
    } catch (err) {
      console.error('Error fetching hostels:', err);
      setError(err.response?.data?.error || 'Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.gender, hasAccess]);

  const requestAllocation = useCallback(async () => {
    if (!hasAccess) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post('/api/allocations/requestAllocation', {
        uniqueId: user.uniqueId,
        gender: user.gender // Use gender from profile, not user selection
      });

      if (data.success) {
        setAllocation(data.allocation);
        setUser(prev => ({ ...prev, allocationStatus: ALLOCATION_STATUS.ALLOCATED }));
        setCurrentStep(2);
      } else {
        setError(data.message || data.error || 'Allocation failed');
      }
    } catch (err) {
      console.error('Error requesting allocation:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to request allocation');
    } finally {
      setLoading(false);
    }
  }, [user?.uniqueId, user?.gender, hasAccess]);

  const confirmAllocation = useCallback(async () => {
    if (!hasAccess) return;
    
    setLoading(true);
    
    try {
      const { data } = await api.post('/api/allocations/confirmAllocation', {
        uniqueId: user.uniqueId,
        allocation_id: allocation.allocation_id
      });

      if (data.success) {
        setAllocation(prev => ({ ...prev, status: 'CONFIRMED' }));
        setUser(prev => ({ ...prev, allocationStatus: ALLOCATION_STATUS.CONFIRMED }));
      } else {
        setError(data.error || 'Failed to confirm allocation');
      }
    } catch (err) {
      console.error('Error confirming allocation:', err);
      setError(err.response?.data?.error || 'Failed to confirm allocation');
    } finally {
      setLoading(false);
    }
  }, [user?.uniqueId, allocation?.allocation_id, hasAccess]);

  const cancelAllocation = useCallback(async () => {
    if (!hasAccess) return;
    
    setLoading(true);
    
    try {
      const { data } = await api.post('/api/allocations/cancelAllocation', {
        uniqueId: user.uniqueId,
        allocation_id: allocation.allocation_id
      });

      if (data.success) {
        setAllocation(null);
        setUser(prev => ({ 
          ...prev, 
          allocationStatus: ALLOCATION_STATUS.NOT_STARTED
        }));
        setAvailableHostels(null);
        setCurrentStep(0);
      } else {
        setError(data.error || 'Failed to cancel allocation');
      }
    } catch (err) {
      console.error('Error cancelling allocation:', err);
      setError(err.response?.data?.error || 'Failed to cancel allocation');
    } finally {
      setLoading(false);
    }
  }, [user?.uniqueId, allocation?.allocation_id, hasAccess]);

  const handleNext = useCallback(() => {
    if (currentStep === 0) {
      fetchAvailableHostels();
      return;
    }
    if (currentStep === 1 && !allocation) {
      requestAllocation();
      return;
    }
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
      setError(null);
    }
  }, [currentStep, allocation, fetchAvailableHostels, requestAllocation]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setError(null);
    }
  }, [currentStep]);

  const canGoNext = useMemo(() => {
    if (currentStep === 0) return user?.gender && hasAccess;
    if (currentStep === 1) return availableHostels;
    if (currentStep === 2) return allocation;
    return false;
  }, [currentStep, user?.gender, availableHostels, allocation, hasAccess]);

  const steps = useMemo(() => [
    {
      title: 'Confirm Gender',
      component: (
        <GenderConfirmation
          userGender={user?.gender}
          loading={loading}
        />
      ),
    },
    {
      title: 'Review Hostels',
      component: (
        <HostelsDisplay
          availableHostels={availableHostels}
          loading={loading}
        />
      ),
    },
    {
      title: 'Allocation Result',
      component: (
        <AllocationResult
          allocation={allocation}
          loading={loading}
        />
      ),
    },
  ], [user?.gender, availableHostels, allocation, loading]);

  useEffect(() => {
    if (hasAccess) {
      checkExistingAllocation();
    }
  }, [hasAccess, checkExistingAllocation]);

  // Render Access Denied if user hasn't registered for any event
  if (checkingAccess) {
    return (
      <div className="pb-9 mt-3 font-rubik">
        <LoadingSpinner message="Checking access permissions..." />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="pb-9 mt-3 font-rubik">
        <AccessDenied
          message="You must register and pay for at least one event before you can access hostel allocation."
          onGoBack={() => navigate({ to: '/userdashboard' })}
        />
      </div>
    );
  }

  const renderActionButtons = () => {
    const isPendingConfirmation = currentStep === 2 && allocation?.status === 'PENDING_CONFIRMATION';
    const isConfirmed = currentStep === 2 && allocation?.status === 'CONFIRMED';

    if (isPendingConfirmation) {
      return (
        <div className="flex gap-3">
          <button
            onClick={cancelAllocation}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <XCircle className="w-5 h-5" />
            Cancel
          </button>
          <button
            onClick={confirmAllocation}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                Confirm
                <CheckCircle className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      );
    }

    if (isConfirmed) {
      return (
        <button
          onClick={allocationSuccess}
          className="flex items-center gap-2 px-6 py-3 bg-primary-main text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Complete
          <CheckCircle className="w-5 h-5" />
        </button>
      );
    }

    return (
      <button
        onClick={handleNext}
        disabled={!canGoNext || loading}
        className="flex items-center gap-2 px-6 py-3 bg-primary-main text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : currentStep === 1 ? (
          <>
            Request Allocation
            <Home className="w-5 h-5" />
          </>
        ) : (
          <>
            Continue
            <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>
    );
  };

  return (
    <div className="pb-9 mt-3 font-rubik">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <Home className="w-8 h-8 text-primary-main" />
          <h1 className="text-3xl font-bold text-primary-main">Hostel Allocation System</h1>
        </div>
        <p className="text-gray-600">Secure your hostel accommodation in 3 easy steps</p>
      </div>

      <div className="bg-white p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center flex-wrap">
          <div className="flex items-center gap-4">
            <UserProfileImage imageWidth={60} className="lg:flex hidden" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium text-gray-800">{user?.fullName}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Unique ID</p>
            <p className="font-medium text-gray-800">{user?.uniqueId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium text-gray-800">{user?.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <div className="flex items-center gap-2">
              {user?.allocationStatus === ALLOCATION_STATUS.CONFIRMED ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : user?.allocationStatus === ALLOCATION_STATUS.ALLOCATED ? (
                <Clock className="w-4 h-4 text-yellow-600" />
              ) : (
                <div className="text-gray-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">NOT STARTED</p>
                </div>
              )}
              <span className={`font-medium text-sm ${
                user?.allocationStatus === ALLOCATION_STATUS.CONFIRMED ? 'text-green-600 font-bold' :
                user?.allocationStatus === ALLOCATION_STATUS.ALLOCATED ? 'text-yellow-600' :
                'text-gray-600'
              }`}>
                {user?.allocationStatus?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <StepIndicator steps={steps} currentStep={currentStep} />
        <ErrorAlert error={error} onDismiss={() => setError(null)} />
        <div className="min-h-[400px]">
          {steps[currentStep].component}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0 || loading}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {renderActionButtons()}
      </div>
    </div>
  );
};

export default HostelAllocationDashboard;