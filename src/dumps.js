// PAYSTACK INITIAL CODE :::::



import { PaystackButton } from 'react-paystack';
import Male from "/male.png";
import Female from "/female.png";
import { Wallet, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useCallback } from 'react';
import { useNavigate, } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';

// Constants

const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  ABANDONED: 'abandoned'
};

function PayStack({ userDetails, values, setValues, paymentOption, numberOfPayment }) {
  const numberOfPaymentSess = values?.numberOfPayment ?? 0 
  const single = 100
  // const single = 7500
  
  const PAYMENT_AMOUNTS = {
    single: single,
    multiple: single  * (numberOfPaymentSess + 1)
  };
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.PENDING);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const queryClient = useQueryClient()





  // Generate unique reference for this payment attempt
  const paymentReference = `TXN_${userDetails?.uniqueId?.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`;
  const amount = paymentOption == 'single' ? PAYMENT_AMOUNTS.single : PAYMENT_AMOUNTS.multiple;
  console.log("Values", values, 'numberOfPayemnt', numberOfPaymentSess, "Amounr", amount, PAYMENT_AMOUNTS.single, PAYMENT_AMOUNTS.multiple)

  // Verify payment with backend (backend should call Paystack)
  const verifyPaymentWithBackend = useCallback(async (reference) => {
    try {
      const response = await axios.post(`${backendURL}/api/payment/verify-payment`, {
        reference,
        userId: userDetails?.uniqueId
      });
      console.log("verify Payment",response)
      return response.data.data;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  }, [backendURL, userDetails?.uniqueId]);  



  // Register user event after successful payment
  const registerUserEvent = useCallback(async (paymentData) => {
     console.log("Data T Be Submittted", paymentData)
     const registrationData = {
      ...values,
      ...paymentData,
      paymentOption,
      userId: userDetails?.uniqueId
    };

    try {
      const response = await axios.post(`${backendURL}/api/userRegisteredEvents`, registrationData);
      // Generate Codes Upon Registration
      if(paymentOption == 'multiple'){
        // ##### Generate Code First
        const codesGenerated = await axios.post(`${backendURL}/api/payment/generate-code`, {
          "numberOfPersons": numberOfPaymentSess
        });
        // ##Save THe Code
        const saveCode = await axios.post(`${backendURL}/api/payment/save-codes`, {
          "payerId": userDetails?.uniqueId,
          "payerArchdeaconry": userDetails?.archdeaconry,
          "eventId": values?.eventId,
          "eventTitle": values?.eventTitle,
          "codes": codesGenerated?.data?.data
        });

        console.log("This arer ths Codes", codesGenerated, "Saved Code", saveCode)
      }
      else{
        console.log("No Code Genereated")
      }

      return response.data;
    } catch (error) {
      console.error('Event registration failed:', error);
      throw new Error(error.response?.data?.errors?.error || 'Registration failed');
    }
  }, [values, paymentOption, userDetails?.uniqueId, backendURL]);






  //#######    HANDLES SUCCESSFUL PAYMENT
  const handlePaymentSuccess = useCallback(async (paystackResponse) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setPaymentStatus(PAYMENT_STATUS.SUCCESS);

    try {
      console.log('Payment successful:', paystackResponse);
      
      // Verify payment with backend
      const verificationResult = await verifyPaymentWithBackend(paystackResponse.reference);
      console.log("This is the verification Restul", verificationResult)
      if (verificationResult.status !== 'success') {
        throw new Error('Payment verification failed');
      }

      // Register the event
      await registerUserEvent({
        paymentStatus: verificationResult.status,
        reference: verificationResult.reference,
        modeOfPayment: verificationResult.channel,
        paymentTime: verificationResult.paid_at,
        paymentID: verificationResult.id,
        amountOfPeople: paymentOption == 'multiple' ? numberOfPaymentSess : "1"
      });

      console.log(queryClient.getQueriesData({}))
      await queryClient.invalidateQueries({ queryKey: ['allEvent', userDetails?.uniqueID] });
     await queryClient.invalidateQueries({ queryKey: ['userRegisteredEvents', userDetails?.uniqueId] });

      toast.success('Payment successful! Registration completed.');
      navigate({ to: '/userdashboard' });

    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentStatus(PAYMENT_STATUS.FAILED);
      toast.error(`Payment Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, verifyPaymentWithBackend, registerUserEvent, navigate]);





  //######## Handle payment gateway closure (cancelled/failed)
  const handlePaymentClose = useCallback(async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    console.log('Payment gateway closed');

    try {
      // Check if payment was actually completed despite gateway closure
      const verificationResult = await verifyPaymentWithBackend(paymentReference);
      
      if (verificationResult.status === 'success') {
        // Payment was successful, treat as success
        await handlePaymentSuccess({ reference: paymentReference });
      } else if (verificationResult.status === 'abandoned'){
        setPaymentStatus(PAYMENT_STATUS.ABANDONED);
        toast.warning('Payment was cancelled or incomplete. Please try again.');
        navigate({ to: '/userdashboard' });
      }
       else {
       throw new Error(PAYMENT_STATUS.FAILED)
      } 
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus(PAYMENT_STATUS.FAILED);
      toast.error('Unable to verify payment status. Please contact support if payment was deducted.');
      navigate({ to: '/userdashboard' });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, verifyPaymentWithBackend, paymentReference, handlePaymentSuccess, navigate]);

  // Component props for PaystackButton
  const componentProps = {
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    reference: paymentReference,
    email: userDetails?.email,
    amount: amount * 100, // Convert to kobo
    currency: 'NGN',
    text: isProcessing ? (
      <span className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Processing...
      </span>
    ) : (
      'Proceed To Payment'
    ),
    metadata: {
      userId: userDetails?.uniqueId,
      fullName: userDetails?.fullName,
      paymentOption: paymentOption,
    },
    onSuccess: handlePaymentSuccess,
    onClose: handlePaymentClose,
  };

  // Validation
  if (!userDetails?.email || !userDetails?.uniqueId) {
    return (
      <div className="text-center text-red-500">
        <p>Missing user details. Please refresh and try again.</p>
      </div>
    );
  }

  return (
    <div className="lg:flex grid items-center gap-4">
      {/* User Avatar */}
      <div className="lg:basis-[50%] basis-[100%] grid place-content-center">
        <img 
          src={userDetails?.gender === 'Male' ? Male : Female} 
          alt={`${userDetails?.gender} avatar`}
          className="w-[300px] object-contain"
        />
      </div>
      
      {/* Payment Details */}
      <div className="grid items-center lg:basis-[50%] basis-[100%] gap-4">
        <h2 className="flex items-center text-[20px] py-3">
          <Wallet className="mr-3 w-[30px]" /> 
          Your Payment Details
        </h2>

        {/* User Information */}
        <div className="space-y-3">
          <p className="text-[14px]">
            Name: <span className="ml-3 font-[500] text-primary-main">{userDetails?.fullName}</span>
          </p>
          <p className="text-[14px]">
            Email: <span className="ml-3 font-[500] text-primary-main">{userDetails?.email}</span>
          </p>
          <p className="text-[14px]">
            Unique ID: <span className="ml-3 font-[500] text-primary-main">{userDetails?.uniqueId}</span>
          </p>
        </div>
        
        {/* Payment Information */}
        <div className="mb-4 space-y-3">
          <p className="text-[14px]">
            Reference ID: <span className="ml-3 font-[500] text-reddish">{paymentReference}</span>
          </p>
          <p className="text-[14px]">
            Amount: <span className="ml-3 font-[500] text-reddish">₦{amount}</span>
          </p>
          <p className="text-[14px]">
            Payment Type: <span className="ml-3 font-[500] text-reddish capitalize">{paymentOption}</span>
          </p>
        </div>

        {/* Payment Button */}
        <PaystackButton 
          className="bg-primary-main [padding:var(--spacing-button)] rounded-sm hover:bg-text-header text-white transition ease-in-out delay-20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isProcessing}
          {...componentProps} 
        />
        
        {paymentStatus === PAYMENT_STATUS.FAILED && (
          <p className="text-red-500 text-[15px] text-center">
              
          </p>
        )}
      </div>
    </div>
  );
}

export default PayStack;





// PAYMEN :::::ID:::::
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../lib/AuthContext'
import MultiSteps from '../../../components/MultiStep/MultiStep'

export const Route = createFileRoute('/userdashboard/event/$id')({
  component: SingleEvent,
})

function SingleEvent() {
  const { userData, userRegisteredEvents } = useAuth()
  const queryClient = useQueryClient()
  const { id } = Route.useParams()
  const [cachedEvent, setCachedEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get cached events data
    const events = queryClient.getQueryData(['allEvent', userData?.uniqueId, userRegisteredEvents])
    console.log("Cached Events: ", events, "user Details", userData, "User Registered Events: ", userRegisteredEvents, "id:", id)
    // Check if events exists and is an array before using .find()
    if (events && Array.isArray(events)) {
      const event = events.find((event) => event?._id === id)
      setCachedEvent(event || null)
    } else {
      setCachedEvent(null)
    }
    
    setLoading(false)
  }, [queryClient, id, userData?.uniqueId, userRegisteredEvents])

  console.log('Cached Event: ', cachedEvent)

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#f4f7fa] py-[30px] font-rubik border">
        <p className="text-center">Loading event details...</p>
      </div>
    )
  }

  // Event not found state
  if (!cachedEvent) {
    return (
      <div className="bg-[#f4f7fa] py-[30px] font-rubik border">
        <p className="text-center text-red-500">
          Event not found. Please make sure the event exists.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[#f4f7fa] py-[30px] font-rubik border">
      {/* Uncomment when needed */}
      {/* <p className='text-[18px] border border-red-500'>
        Register For: <span className='text-primary-main font-bold'>{cachedEvent.eventTitle}</span>
      </p> */}
      
      <div className="flex items-center basis-[50%]">
        <MultiSteps userData={userData} eventDetails={cachedEvent} />
      </div>
    </div>
  )
}




















































import React, { useState, useEffect, useMemo } from 'react';

import { Home, User, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw, ChevronRight, ChevronLeft } from 'lucide-react';

// API Base URL - Change this to your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// Multi-Step Progress Indicator Component
const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                index < currentStep
                  ? 'bg-green-600 text-white'
                  : index === currentStep
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {index < currentStep ? <CheckCircle className="w-6 h-6" /> : index + 1}
            </div>
            <p className={`text-sm mt-2 font-medium ${
              index === currentStep ? 'text-indigo-600' : 'text-gray-600'
            }`}>
              {step.title}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-1 mx-2 mb-6 transition-all ${
                index < currentStep ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Step 1: Gender Selection Component
const GenderSelection = ({ selectedGender, onGenderSelect, loading }) => {
  const genderOptions = [
    { value: 'MALE', label: 'Male', icon: '👨', description: 'Male hostels available' },
    { value: 'FEMALE', label: 'Female', icon: '👩', description: 'Female hostels available' },
    { value: 'OTHER', label: 'Other', icon: '🧑', description: 'Inclusive hostels available' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Gender</h2>
        <p className="text-gray-600">This will determine which hostels are available for allocation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {genderOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onGenderSelect(option.value)}
            disabled={loading}
            className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
              selectedGender === option.value
                ? 'border-indigo-600 bg-indigo-50 shadow-lg transform scale-105'
                : 'border-gray-200 hover:border-indigo-300 bg-white hover:shadow-md'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {selectedGender === option.value && (
              <div className="absolute top-3 right-3">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
            )}
            <div className="text-4xl mb-3 text-center">{option.icon}</div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-gray-800 mb-1">{option.label}</h3>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Step 2: Available Hostels Display
const HostelsDisplay = ({ availableHostels, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!availableHostels || availableHostels.hostels.length === 0) {
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
        <p className="text-gray-600">Review the available hostels before allocation</p>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Hostels Available</p>
            <p className="text-3xl font-bold text-indigo-600">{availableHostels.available_count}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Spaces</p>
            <p className="text-3xl font-bold text-green-600">{availableHostels.total_spaces}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {availableHostels.hostels.map((hostel) => (
          <div key={hostel.hostel_id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">{hostel.name}</h3>
                <p className="text-sm text-gray-600 mt-1">ID: {hostel.hostel_id}</p>
                {hostel.building_block && (
                  <p className="text-sm text-gray-500 mt-1">Building: {hostel.building_block}</p>
                )}
                {hostel.facilities && hostel.facilities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hostel.facilities.map((facility, idx) => (
                      <span key={idx} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                        {facility}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right ml-4">
                <p className="text-sm text-gray-500">Available</p>
                <p className="text-2xl font-bold text-indigo-600">{hostel.available_spaces}</p>
                <p className="text-xs text-gray-400">of {hostel.total_capacity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-yellow-800 text-sm font-medium">Random Allocation</p>
          <p className="text-yellow-700 text-sm">
            A hostel will be randomly assigned to you from the available options based on space availability.
          </p>
        </div>
      </div>
    </div>
  );
};

// Step 3: Allocation Result
const AllocationResult = ({ allocation, loading, onConfirm, onCancel }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <RefreshCw className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-600">Processing your allocation...</p>
      </div>
    );
  }

  if (!allocation) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No allocation data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          {allocation.status === 'CONFIRMED' ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <Clock className="w-10 h-10 text-yellow-600" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {allocation.status === 'CONFIRMED' ? 'Allocation Confirmed!' : 'Hostel Allocated'}
        </h2>
        <p className="text-gray-600">
          {allocation.status === 'CONFIRMED' 
            ? 'Your hostel has been successfully confirmed' 
            : 'Please review and confirm your allocation'}
        </p>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Home className="w-8 h-8" />
          <h3 className="text-2xl font-bold">{allocation.hostel_name}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-indigo-200 text-sm">Allocation ID</p>
            <p className="font-mono text-sm font-semibold">{allocation.allocation_id}</p>
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

      {allocation.status === 'PENDING_CONFIRMATION' && allocation.expires_at && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-800 font-semibold mb-1">⏰ Time Sensitive</p>
              <p className="text-yellow-700 text-sm mb-2">
                You have 48 hours to confirm this allocation. After that, it will expire and the space will be released.
              </p>
              <p className="text-yellow-800 text-sm font-medium">
                Expires: {formatDate(allocation.expires_at)}
              </p>
            </div>
          </div>
        </div>
      )}

      {allocation.status === 'CONFIRMED' && (
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
};

// Main Dashboard Component
const HostelAllocationDashboard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState({
    id: 'U12345',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    gender: null,
    allocationStatus: 'NOT_STARTED'
  });

  const [allocation, setAllocation] = useState(null);
  const [availableHostels, setAvailableHostels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkExistingAllocation();
  }, []);

  const checkExistingAllocation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/allocations/status/${user.id}`);
      const data = await response.json();

      if (data.success && data.status !== 'NOT_STARTED') {
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
    } catch (error) {
      console.error('Error checking allocation:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableHostels = async (gender) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/hostels/available?gender=${gender}`);
      const data = await response.json();

      if (data.success) {
        setAvailableHostels(data);
      } else {
        setError(data.error || 'Failed to fetch available hostels');
      }
    } catch (error) {
      console.error('Error fetching hostels:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenderSelect = (gender) => {
    setUser({ ...user, gender });
    setError(null);
    fetchAvailableHostels(gender);
  };

  const requestAllocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/allocations/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          gender: user.gender
        })
      });

      const data = await response.json();

      if (data.success) {
        setAllocation(data.allocation);
        setUser({ ...user, allocationStatus: 'ALLOCATED' });
        setCurrentStep(2);
      } else {
        setError(data.message || data.error || 'Allocation failed');
      }
    } catch (error) {
      console.error('Error requesting allocation:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const confirmAllocation = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/allocations/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          allocation_id: allocation.allocation_id
        })
      });

      const data = await response.json();

      if (data.success) {
        setAllocation({ ...allocation, status: 'CONFIRMED' });
        setUser({ ...user, allocationStatus: 'CONFIRMED' });
      } else {
        setError(data.error || 'Failed to confirm allocation');
      }
    } catch (error) {
      console.error('Error confirming allocation:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelAllocation = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/allocations/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          allocation_id: allocation.allocation_id
        })
      });

      const data = await response.json();

      if (data.success) {
        setAllocation(null);
        setUser({ ...user, allocationStatus: 'NOT_STARTED', gender: null });
        setAvailableHostels(null);
        setCurrentStep(0);
      } else {
        setError(data.error || 'Failed to cancel allocation');
      }
    } catch (error) {
      console.error('Error cancelling allocation:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = useMemo(() => {
    const baseSteps = [
      {
        title: 'Select Gender',
        component: (
          <GenderSelection
            selectedGender={user.gender}
            onGenderSelect={handleGenderSelect}
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
            onConfirm={confirmAllocation}
            onCancel={cancelAllocation}
          />
        ),
      },
    ];

    return baseSteps;
  }, [user.gender, availableHostels, allocation, loading]);

  const handleNext = () => {
    if (currentStep === 0 && !user.gender) {
      setError('Please select your gender to continue');
      return;
    }
    if (currentStep === 0 && user.gender && !availableHostels) {
      return;
    }
    if (currentStep === 1 && !allocation) {
      requestAllocation();
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const canGoNext = () => {
    if (currentStep === 0) return user.gender && availableHostels;
    if (currentStep === 1) return availableHostels;
    if (currentStep === 2) return allocation;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Home className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Hostel Allocation System</h1>
          </div>
          <p className="text-gray-600">Secure your hostel accommodation in 3 easy steps</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Student Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-800">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Student ID</p>
              <p className="font-medium text-gray-800">{user.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div className="flex items-center gap-2">
                {user.allocationStatus === 'CONFIRMED' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : user.allocationStatus === 'ALLOCATED' ? (
                  <Clock className="w-4 h-4 text-yellow-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                )}
                <span className={`font-medium text-sm ${
                  user.allocationStatus === 'CONFIRMED' ? 'text-green-600' :
                  user.allocationStatus === 'ALLOCATED' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {user.allocationStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Step Indicator */}
          <StepIndicator steps={steps} currentStep={currentStep} />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Current Step Content */}
          <div className="min-h-[400px]">
            {steps[currentStep].component}
          </div>
        </div>

        {/* Navigation Buttons */}
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

          {currentStep === 2 && allocation?.status === 'PENDING_CONFIRMATION' ? (
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
          ) : currentStep === 2 && allocation?.status === 'CONFIRMED' ? (
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Complete
              <CheckCircle className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canGoNext() || loading}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default HostelAllocationDashboard;













































import React, { useState, useEffect } from 'react';
import { Home, User, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';

const HostelAllocationDashboard = () => {
  const [user, setUser] = useState({
    id: 'U12345',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    gender: null,
    allocationStatus: 'NOT_STARTED'
  });

  const [allocation, setAllocation] = useState(null);
  const [availableHostels, setAvailableHostels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Simulate API call to check existing allocation on mount
  useEffect(() => {
    checkExistingAllocation();
  }, []);

  const checkExistingAllocation = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Simulating no existing allocation
      setLoading(false);
    }, 800);
  };

  const fetchAvailableHostels = async (gender) => {
    setLoading(true);
    setError(null);
    
    // Simulate API call to backend
    setTimeout(() => {
      // Mock response based on gender
      const mockHostels = {
        MALE: {
          available_count: 3,
          total_spaces: 45,
          hostels: [
            { hostel_id: 'H001', name: 'Block A - Male', available_spaces: 15 },
            { hostel_id: 'H002', name: 'Block B - Male', available_spaces: 20 },
            { hostel_id: 'H003', name: 'Block C - Male', available_spaces: 10 }
          ]
        },
        FEMALE: {
          available_count: 2,
          total_spaces: 35,
          hostels: [
            { hostel_id: 'H004', name: 'Block D - Female', available_spaces: 20 },
            { hostel_id: 'H005', name: 'Block E - Female', available_spaces: 15 }
          ]
        },
        OTHER: {
          available_count: 1,
          total_spaces: 10,
          hostels: [
            { hostel_id: 'H006', name: 'Block F - Inclusive', available_spaces: 10 }
          ]
        }
      };

      setAvailableHostels(mockHostels[gender] || null);
      setLoading(false);
    }, 1000);
  };

  const handleGenderSelect = (gender) => {
    setUser({ ...user, gender });
    setError(null);
    setAllocation(null);
    fetchAvailableHostels(gender);
  };

  const requestAllocation = async () => {
    if (!user.gender) {
      setError('Please select your gender first');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API call to request allocation
    setTimeout(() => {
      // Simulate random allocation
      if (availableHostels && availableHostels.hostels.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableHostels.hostels.length);
        const selectedHostel = availableHostels.hostels[randomIndex];
        
        const newAllocation = {
          allocation_id: 'A' + Math.random().toString(36).substr(2, 9),
          hostel_id: selectedHostel.hostel_id,
          hostel_name: selectedHostel.name,
          allocated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          status: 'PENDING_CONFIRMATION'
        };

        setAllocation(newAllocation);
        setUser({ ...user, allocationStatus: 'ALLOCATED' });
        setShowConfirmation(true);
      } else {
        setError('No hostels available for your gender. Please contact administration.');
      }
      setLoading(false);
    }, 1500);
  };

  const confirmAllocation = async () => {
    setLoading(true);
    
    // Simulate API call to confirm allocation
    setTimeout(() => {
      setAllocation({ ...allocation, status: 'CONFIRMED' });
      setUser({ ...user, allocationStatus: 'CONFIRMED' });
      setShowConfirmation(false);
      setLoading(false);
    }, 1000);
  };

  const cancelAllocation = () => {
    setAllocation(null);
    setUser({ ...user, allocationStatus: 'NOT_STARTED' });
    setShowConfirmation(false);
    setAvailableHostels(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Home className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Hostel Allocation</h1>
          </div>
          <p className="text-gray-600">Secure your hostel accommodation</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Student Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-800">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Student ID</p>
              <p className="font-medium text-gray-800">{user.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div className="flex items-center gap-2">
                {user.allocationStatus === 'CONFIRMED' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : user.allocationStatus === 'ALLOCATED' ? (
                  <Clock className="w-4 h-4 text-yellow-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                )}
                <span className={`font-medium ${
                  user.allocationStatus === 'CONFIRMED' ? 'text-green-600' :
                  user.allocationStatus === 'ALLOCATED' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {user.allocationStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gender Selection */}
        {!allocation && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Your Gender</h2>
            <p className="text-gray-600 mb-4">
              This will determine which hostels are available for allocation
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['MALE', 'FEMALE', 'OTHER'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => handleGenderSelect(gender)}
                  disabled={loading}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    user.gender === gender
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="font-semibold">{gender}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Available Hostels Info */}
        {availableHostels && !allocation && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Hostels</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800">
                <strong>{availableHostels.available_count}</strong> hostel(s) available with{' '}
                <strong>{availableHostels.total_spaces}</strong> total spaces for {user.gender} students
              </p>
            </div>
            <div className="space-y-3">
              {availableHostels.hostels.map((hostel) => (
                <div key={hostel.hostel_id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{hostel.name}</p>
                    <p className="text-sm text-gray-600">ID: {hostel.hostel_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Available Spaces</p>
                    <p className="font-bold text-indigo-600">{hostel.available_spaces}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Allocation Result */}
        {allocation && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              {allocation.status === 'CONFIRMED' ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Clock className="w-8 h-8 text-yellow-600" />
              )}
              <h2 className="text-xl font-semibold text-gray-800">
                {allocation.status === 'CONFIRMED' ? 'Allocation Confirmed!' : 'Hostel Allocated'}
              </h2>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 mb-4">
              <h3 className="text-2xl font-bold text-indigo-900 mb-2">{allocation.hostel_name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-600">Allocation ID</p>
                  <p className="font-mono text-sm text-gray-800">{allocation.allocation_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hostel ID</p>
                  <p className="font-mono text-sm text-gray-800">{allocation.hostel_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Allocated At</p>
                  <p className="text-sm text-gray-800">{formatDate(allocation.allocated_at)}</p>
                </div>
                {allocation.status === 'PENDING_CONFIRMATION' && (
                  <div>
                    <p className="text-sm text-gray-600">Expires At</p>
                    <p className="text-sm text-red-600 font-semibold">{formatDate(allocation.expires_at)}</p>
                  </div>
                )}
              </div>
            </div>

            {allocation.status === 'PENDING_CONFIRMATION' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ You have 48 hours to confirm this allocation. After that, it will expire and the space will be released.
                </p>
              </div>
            )}

            {allocation.status === 'CONFIRMED' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 text-sm">
                  ✓ Your hostel allocation has been confirmed. Please check your email for further instructions.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {!allocation && user.gender && availableHostels && (
            <button
              onClick={requestAllocation}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Home className="w-5 h-5" />
                  Request Hostel Allocation
                </>
              )}
            </button>
          )}

          {allocation && allocation.status === 'PENDING_CONFIRMATION' && (
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={confirmAllocation}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Confirm Allocation
                  </>
                )}
              </button>
              <button
                onClick={cancelAllocation}
                disabled={loading}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Cancel
              </button>
            </div>
          )}

          {allocation && allocation.status === 'CONFIRMED' && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Need help? Contact the hostel administration office.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Back to Dashboard
              </button>
            </div>
          )}

          {!user.gender && (
            <div className="text-center text-gray-500">
              Please select your gender to view available hostels
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostelAllocationDashboard;

















































































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
