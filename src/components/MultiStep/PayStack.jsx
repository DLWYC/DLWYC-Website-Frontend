import Male from "/male.png";
import Female from "/female.png";
import { Wallet, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';


const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  ABANDONED: 'abandoned'
};

function PayStack({ userDetails, values, setValues, paymentOption }) {
    console.log("PayStack Component Props", { userDetails, values, paymentOption });
  const numberfPeopleToBePayedFor = values?.numberfPeopleToBePayedFor ?? 0;
  const single = 7500 // Production amount
  
  const PAYMENT_AMOUNTS = {
    single: single,
    multiple: single * (numberfPeopleToBePayedFor + 1)
  };
  
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.PENDING);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const queryClient = useQueryClient();

  // Generate unique reference for this payment attempt
  const paymentReference = `TXN_${userDetails?.uniqueId?.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`;
  const amount = paymentOption === 'single' ? PAYMENT_AMOUNTS.single : PAYMENT_AMOUNTS.multiple;

  // Initialize payment and get authorization URL from backend
  const initializePayment = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      const payStackData = {
        email: userDetails?.email,
        amount: amount * 100, // Convert to kobo
        reference: paymentReference,
        currency: 'NGN',
        metadata: {
          userId: userDetails?.uniqueId,
          fullName: userDetails?.fullName,
          paymentOption: paymentOption,
          numberfPeopleToBePayedFor: numberfPeopleToBePayedFor,
          eventId: values?.eventId,
          eventTitle: values?.eventTitle
        },
        callback_url: `${window.location.origin}/userdashboard/event/verifyPayment?eventId=${values?.eventId}`, // Where Paystack redirects after payment
      };

      console.log('Initializing payment with:', payStackData);

      // Send request to your backend to initialize payment
      const response = await axios.post(`${backendURL}/api/payment/initializeTransaction/`,  payStackData);
      
      if (response.data?.data?.authorization_url) {
        window.location.href = response.data.data.authorization_url;
      } else {
        throw new Error('Failed to get payment authorization URL');
      }
      
    } catch (error) {
      console.error('Payment initialization error:', error);
      setPaymentStatus(PAYMENT_STATUS.FAILED);
      toast.error(`Payment Error: ${error.response?.data?.message || error.message}`);
      setIsProcessing(false);
    }
  }, [userDetails, amount, paymentReference, numberfPeopleToBePayedFor, backendURL]);

  
  // Validation
  if (!userDetails?.email || !userDetails?.uniqueId) {
    return (
      <div className="text-center text-red-500 p-4">
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
            Amount: <span className="ml-3 font-[500] text-reddish">₦{amount.toLocaleString()}</span>
          </p>
          <p className="text-[14px]">
            Payment Type: <span className="ml-3 font-[500] text-reddish capitalize">{paymentOption}</span>
          </p>
          {paymentOption === 'multiple' && (
            <p className="text-[14px]">
              Number of People: <span className="ml-3 font-[500] text-reddish">{numberfPeopleToBePayedFor + 1}</span>
            </p>
          )}
        </div>

        {/* Custom Payment Button */}
        <button
          onClick={initializePayment}
          disabled={isProcessing}
          className="bg-primary-main [padding:var(--spacing-button)] rounded-sm hover:bg-text-header text-white transition ease-in-out delay-20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <p className="text-white text-[14px] text-center font-medium flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirecting to payment gateway...
            </p>
          ) : (
            'Proceed To Payment'
          )}
        </button>
        
        {/* Status Messages */}
        {paymentStatus === PAYMENT_STATUS.FAILED && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-[14px] text-center font-medium">
              Payment failed. Please try again.
            </p>
          </div>
        )}
        

      </div>
    </div>
  );
}

export default PayStack;