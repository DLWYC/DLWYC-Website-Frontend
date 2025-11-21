import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../../lib/AuthContext';



export const Route = createFileRoute('/userdashboard/event/verifyPayment')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userData } = useAuth();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
   const hasVerified = useRef(false);

   // Get reference from URL params (?reference=xyz)
  const searchParams = useSearch({ from: '/userdashboard/event/verifyPayment' });
  const reference = searchParams?.reference;

  const [message, setMessage] = useState('Verifying your payment...');
  const PAYMENT_STATUS = {
    VERIFYING: 'verifying',
    SUCCESS: 'success',
    FAILED: 'failed'
  };
  const [status, setStatus] = useState(PAYMENT_STATUS.VERIFYING);

  console.log("Register User Event Called with:", userData);

  // Register user event after successful payment
const registerUserEvent = useCallback(async (paymentData) => {
  
  
  try {
    // Validate required data upfront
    // if (!userData?.uniqueId) {
    //   throw new Error('User ID is required for registration');
    // }
  
    if (!paymentData?.eventId || !paymentData?.eventTitle) {
      throw new Error('Event information is incomplete');
    }

    const registrationData = {
      ...paymentData,
      userId: userData.uniqueId
    };


    // Step 1: Register the event
    const response = await axios.post(
      `${backendURL}/api/userRegisteredEvents`, 
      registrationData
    );
    
    // Step 2: Handle multiple payment codes if needed
    if (paymentData?.paymentOption === 'multiple') {
      const numberfPeopleToBePayedForSess = paymentData?.numberfPeopleToBePayedFor ?? 0;
      
      if (numberfPeopleToBePayedForSess <= 0) {
        console.warn('Invalid number of payment sessions for multiple payment');
        throw new Error('Number of payment sessions must be greater than 0');
      }
      
      // Generate codes
      const codesGenerated = await axios.post(
        `${backendURL}/api/payment/generate-code`,
        { numberOfPersons: numberfPeopleToBePayedForSess }
      );
      
      if (!codesGenerated?.data?.data || !Array.isArray(codesGenerated.data.data)) {
        throw new Error('Failed to generate payment codes');
      }
      
      // Save codes
      await axios.post(`${backendURL}/api/payment/save-codes`, {
        payerId: userData.uniqueId,
        payerArchdeaconry: userData.archdeaconry,
        eventId: paymentData.eventId,
        eventTitle: paymentData.eventTitle,
        codes: codesGenerated.data.data
      });

      console.log('Payment codes generated and saved successfully');
    }

    return response.data;
  } catch (error) {
    console.error('Event registration failed:', error);
    const errorMessage = error.response?.data?.errors?.error 
      || error.response?.data?.message 
      || error.message 
      || 'Registration failed';
    throw new Error(errorMessage);
  }
}, [userData, backendURL]);


// Verify payment and register event
const verifyPayment = useCallback(async () => {
  if (!reference) {
    setStatus(PAYMENT_STATUS.FAILED);
    setMessage('Invalid payment reference');
    return;
  }

  // Set loading state
  setStatus(PAYMENT_STATUS.VERIFYING);
  setMessage('Verifying payment...');

  try {
    // Step 1: Verify payment with backend
    const response = await axios.post(`${backendURL}/api/payment/verify-payment`, {
      reference,
      userId: userData?.uniqueId
    });

    const verificationResult = response.data.data;
    console.log("Verification Result", verificationResult);

    if (verificationResult.status !== 'success') {
      throw new Error('Payment verification failed');
    }

    // Step 2: Calculate number of people for payment
    const numberfPeopleToBePayedForSess = verificationResult?.metadata?.paymentOption === 'multiple' 
      ? (verificationResult?.metadata?.numberfPeopleToBePayedFor ?? 1)
      : 1;

    // Step 3: Register the event with all payment details
    await registerUserEvent({
      paymentStatus: verificationResult.status,
      reference: verificationResult.reference,
      modeOfPayment: verificationResult.channel,
      paymentTime: verificationResult.paid_at,
      paymentID: verificationResult.id,
      amountOfPeople: numberfPeopleToBePayedForSess,
      numberfPeopleToBePayedFor: numberfPeopleToBePayedForSess, // Pass this for code generation
      eventId: verificationResult?.metadata?.eventId,
      eventTitle: verificationResult?.metadata?.eventTitle,
      paymentOption: verificationResult?.metadata?.paymentOption,
      uniqueID: userData?.uniqueId,
      fullName: userData?.fullName,
      email: userData?.email,
    });

    // Step 4: Invalidate queries to refresh data
 await queryClient.invalidateQueries({ queryKey: ['allEvent', userData?.uniqueID] });
     await queryClient.invalidateQueries({ queryKey: ['userRegisteredEvents', userData?.uniqueId] });

    // Step 5: Update UI state
    setStatus(PAYMENT_STATUS.SUCCESS);
    setMessage('Payment successful! Registration completed.');
    toast.success('Payment successful!');

    // Step 6: Redirect to dashboard after 3 seconds
    const timeoutId = setTimeout(() => {
      navigate({ to: '/userdashboard' });
    }, 3000);

    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);

  } catch (error) {
    console.error('Payment verification error:', error);
    setStatus(PAYMENT_STATUS.FAILED);
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Payment verification failed';
    setMessage(errorMessage);
    toast.error(errorMessage);
  }
}, [registerUserEvent, navigate, setStatus, setMessage]);


// Run verification only once when component mounts or reference changes

useEffect(() => {
  // Only verify once and if we have a reference
  if (!hasVerified.current && reference) {
    hasVerified.current = true;
    verifyPayment();
  }
}, [reference, verifyPayment])



return (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-12 max-w-md w-full text-center">
      
      {status === PAYMENT_STATUS.VERIFYING && (
        <div className="space-y-6">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Verifying Payment......
            </h2>
            <p className="text-gray-600">{message}</p>
          </div>

          
        </div>
      )}

      {status === PAYMENT_STATUS.SUCCESS && (
        <div className="space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900">
              Payment Successful!
            </h2>
            <p className="text-gray-600">{message}</p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
              Redirecting to dashboard...
            </div>
          </div>
        </div>
      )}

      {status === PAYMENT_STATUS.FAILED && (
        <div className="space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900">
              Payment Failed
            </h2>
            <p className="text-gray-600">{message}</p>
          </div>

          <button
            onClick={() => navigate({ to: '/userdashboard' })}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  </div>

);
}



