import { useAuth } from "@/lib/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { useState } from "react";
import { useCallback } from "react";
import { toast } from "react-toastify";


const Confirmation = ({values}) => {
  console.log("Values CONFIRMTION PAGE", values)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL
  const queryClient = useQueryClient()
  const {userData, userRegisteredEvents} = useAuth()
  // console.log("all Cached Data", queryClient.getQueryData(['allEvent', userData?.uniqueId, userRegisteredEvents]), "ALL", queryClient.getQueriesData())


  const ERROR_MESSAGES = {
  CODE_UPDATE_FAILED: 'Failed to update code status',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_ERROR: 'Please Go Back And Fill The Details.'
};

    //  console.log("ONFIRMATION PAGE:", values)
      const updateValues = {
                "payersId": values?.payersId, 
                "paymentCode": values?.paymentID, 
                "archdeaconry": values?.archdeaconry,
                "eventTitle": values?.eventTitle,
                "userName": values?.fullName, 
                "userId": values?.uniqueID, 
                "userEmail": values?.email
            }

            // ################# Check the Values ####################
    const validateRegistrationData = (values, updateValues) => {
    if (!values || Object.keys(values).length === 0) {
      throw new Error('Registration data is missing');
    }
    if (!updateValues || Object.keys(updateValues).length === 0) {
      throw new Error('Update values are missing');
    }
    return true;
  };


  // 
  const updateCodeStatus = async (updateValues) => {
    try {
      const response = await axios.patch(
        `${backendURL}/api/payment/update-code-status`, 
        updateValues,
        {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Code status updated:', response?.data?.data?.message);
      return response.data;
    } catch (error) {
      console.error('Code update failed:', error);
      throw new Error(ERROR_MESSAGES.CODE_UPDATE_FAILED);
    }
  };



   const registerUser = async (values) => {
    try {
      const response = await axios.post(`${backendURL}/api/userRegisteredEvents`, values);
      
      console.log('User registered:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      
      // Handle different error types
      // if (error.response?.data?.error?.error) {
        throw new Error(error.response?.data?.errors?.error);
      // } else if (error.response?.status >= 500) {
        // throw new Error('Server error. Please try again later.');
      // } else if (error.code === 'ECONNABORTED') {
      //   throw new Error('Request timeout. Please try again.');
      // }
      
      throw new Error(ERROR_MESSAGES.REGISTRATION_FAILED);
    }
  };


     const confirmRegistration = useCallback(async (e) =>{
          e.preventDefault()
          console.log("Update Values", updateValues)
       // Prevent double submission
    if (isLoading) {
      console.warn('Registration already in progress');
      return;
    }

    setIsLoading(true);

          try {
      // Validate data first
      validateRegistrationData(values, updateValues);
      
      console.log('Starting registration process...');
      console.log('Update Values:', updateValues);
      console.log('Registration Values:', values);

      // Step 1: Update code status
      const updateReponse = await updateCodeStatus(updateValues);
      console.log("updateReponse", updateReponse)
      if(updateReponse?.success == true){
        
        
        // Step 2: Register user
        const registrationResult = await registerUser(values);
        console.log("registrationResult", registrationResult)
          
          
          // Success
          toast.success("Registration completed successfully");
          console.log('Registration completed successfully');

           // CRITICAL: Invalidate queries to refresh data
      await queryClient.invalidateQueries({
        queryKey: ['userRegisteredEvents', userData?.uniqueId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['allEvent', userData?.uniqueId, userRegisteredEvents],
      });

          // Navigate to dashboard
          navigate({ to: '/userdashboard' });
        }

        else{
          throw new Error("Error Updating Code")
        }
      
     } catch (error) {
      console.error('Registration process failed:', error);
      toast.error(error.message || ERROR_MESSAGES.REGISTRATION_FAILED);
      
      // Don't navigate on error
      
    }
     finally {
      setIsLoading(false);
    }
    }, [isLoading, navigate, backendURL])

     return(
  <div className="step-content p-6 bg-white rounded-lg shadow-sm text-center">
    <div className="mb-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Registration</h2>
      <p className="text-gray-600">Click The Button Below!!</p>
    </div>
    <div className="">
        <button 
        type="submit" 
        // disabled={isLoading}
        className={`px-6 py-2 rounded-sm transition-colors ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-primary-main hover:bg-primary-main text-white'
        }`}
        onClick={confirmRegistration}
      >
        {isLoading ? 'Processing...' : 'Confirm Registration'}
      </button>
    </div>
    {/* <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
      <p className="text-green-800">A confirmation email will be sent to you shortly.</p>
    </div> */}
  </div>
)};



export default Confirmation