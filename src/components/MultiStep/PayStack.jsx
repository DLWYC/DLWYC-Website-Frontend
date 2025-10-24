


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
  const single = 7500
  
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
