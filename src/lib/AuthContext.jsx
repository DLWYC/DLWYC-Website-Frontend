import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
const AuthContext = createContext();

export function AuthProvider({children}){
     const queryClient = useQueryClient()
     const backendUrl = import.meta.env.VITE_BACKEND_URL

  // #:::::::::::::::  GET USER LOGIN FUNCTION :::::::::::::::::#
const login = useMutation({
  mutationFn: async({values})=>{
     const res = await axios.post(`${backendUrl}/api/userLogin`, values);
     localStorage.setItem("token", res.data.token);
    return res
  }, 
  onSuccess: (res) =>{
    queryClient.invalidateQueries({ queryKey: ['user'] });
    return res
  },
  onError: (err) =>{ // Removed async - not needed here
      const errType = err.response?.data?.errors
      console.log("Error Type: ", errType)
      throw errType
  }
})

// #:::::::::::::::  GET USER DATA FUNCTION :::::::::::::::::#
const {data: user, isLoading: isLoadingUserData, error: errorLoadingUserData} = useQuery({
   queryKey: ['user'],
   queryFn: async () =>{
    const userToken = localStorage.getItem('token');
    
    // Validate token exists
    if (!userToken) {
      throw new Error("INVALID_TOKEN")
    }

    try {
      const userDashboardData = await axios.get(`${backendUrl}/api/userDashboard`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
      
      if (!userDashboardData?.data?.data) {
        throw new Error("Failed To Fetch User Data")
      }

      // Safe logging with optional chaining and fallback
      const userData = userDashboardData.data.data;
      const lastName = userData?.fullName?.split(" ")?.[1] || userData?.fullName || "N/A";
      console.log("User Dashboard Name: ", lastName);
      
      return userData;
      
    } catch(err) {
      const errMessage = err?.response?.data?.message;
      const nothing = err?.response?.data?.error?.error;
      
      // Check for invalid token scenarios
      if (nothing === "Nothing" || errMessage === "Invalid token") {
        throw new Error("INVALID_TOKEN")
      }
      
      // Re-throw the error so React Query can handle it properly
      throw err;
    }
  },
  enabled: !!localStorage.getItem('token'), // Only run if token exists
  retry: false,
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
})
  




// RegistrationUnit Login Function
const registrationUnitLogin = useMutation({
  mutationFn: async({values})=>{
     const res = await axios.post(`${backendUrl}/api/registrationUnit/auth`, values);
     localStorage.setItem("registrationUnitToken", res?.data?.token);
    return res
  }, 
  onSuccess: (res) =>{
    queryClient.invalidateQueries({ queryKey: ['registrationUnit'] });
    return res
  },
  onError: (err) =>{ // Removed async - not needed here
      const errType = err.response?.data?.errors
      console.log("Error Type: ", errType)
      throw errType
  }
})

  
  
  // #:::::::::::::::  GET USER PAYMENT RECORDS FUNCTION :::::::::::::::::#
  const {data: userPaymentRecord, isLoading: fetchingUserPaymentRecordLoadingStatus, isError: errorLoadingUserPaymentRecord, refetch} = useQuery({
    queryKey: ['UserPaymentRecord', user?.uniqueId],
    queryFn: async () =>{
      const UserPaymentRecord = await axios.get(`${backendUrl}/api/payment/payment-history/${user?.uniqueId}`)
      
        return UserPaymentRecord.data.data
    },
    onError: (error)=>{
      // console.log("Error: ", error)
    },
    enabled: !!user?.uniqueId,
    refetchOnWindowFocus: false,
    staleTime: 1000
  })


  // #:::::::::::::::  GET USER PAYMENT RECORDS FUNCTION :::::::::::::::::#
  
  
  
  // #:::::::::::::::  GET USER REGISETRED FUNCTION :::::::::::::::::#
  const {data: userRegisteredEvents, isLoading: fetchingUserRegisteredEventsLoadingStatus, isError: errorLoadingUserRegisteredEvents} = useQuery({
    queryKey: ['userRegisteredEvents', user?.uniqueId],
    queryFn: async () =>{
      const userRegisteredEvents = await axios.get(`${backendUrl}/api/userRegisteredEvents/${user?.email}/${user?.uniqueId}`)
      console.log("User Registered Events:",userRegisteredEvents?.data?.message)
        return userRegisteredEvents?.data?.data
    },
    onError: (error)=>{
      console.log("Error: ", error)
    },
    enabled: !!user?.uniqueId,
    refetchOnWindowFocus: false,
    staleTime: 1000
  })
  // #:::::::::::::::  GET USER REGISETRED FUNCTION :::::::::::::::::#
  
  

// #:::::::::::::::  GET ALL EVENT FUNCTION :::::::::::::::::#
const {
  data: allEvent,
  isLoading: fetchingAllEvents,
  isError: errorLoadingEvents,
} = useQuery({
  queryKey: ['allEvent', user?.uniqueId, userRegisteredEvents], // Add userRegisteredEvents to the key
  queryFn: async () => {
    const response = await axios.get(`${backendUrl}/api/admin/events`);
    const allEventsData = response?.data?.data;

    const registrationMap = new Map();
    
    if (userRegisteredEvents?.length) {
      userRegisteredEvents.forEach(regEvent => {
        registrationMap.set(regEvent.eventId, {
          isRegistered: regEvent.paymentStatus === 'success' ? true : false,
          paymentStatus: regEvent.paymentStatus,
          registrationDate: regEvent.registrationDate,
        });
      });
    }

    const updatedEvents = allEventsData.map((event) => {
      const registrationInfo = registrationMap.get(event._id);
      return {
        ...event,
        isRegistered: registrationInfo?.isRegistered,
        paymentStatus: registrationInfo?.paymentStatus,
      };
    });

    return updatedEvents;
  },
  enabled: !!user?.uniqueId && !fetchingUserRegisteredEventsLoadingStatus,
  onError: (error) => {
    console.error('Failed to load all events:', error);
  },
  refetchOnMount: true,
  refetchOnWindowFocus: true,
});
  // #:::::::::::::::  GET ALL EVENT FUNCTION :::::::::::::::::#
  



  // #:::::::::::::::  USER LOGOUT FUNCTION :::::::::::::::::#
  const logout = () => {
    localStorage.setItem('token', '')
    queryClient.clear();
  }
  // #:::::::::::::::  USER LOGOUT FUNCTION :::::::::::::::::#










     return(
     <AuthContext.Provider  
          value={{
              login: login.mutateAsync,
              loginIsLoading: login.isPending,
              logout,
              registrationUnitLogin: registrationUnitLogin.mutateAsync,
              registrationUnitLoginILoading: registrationUnitLogin.isPending,

              userData: user,
              isLoadingUserData,
              errorLoadingUserData,

              userRegisteredEvents,
              fetchingUserRegisteredEventsLoadingStatus,
              errorLoadingUserRegisteredEvents,


              userPaymentRecord, 
              refetch,
              fetchingUserPaymentRecordLoadingStatus,

               allEvent,
               fetchingAllEvents,
               errorLoadingEvents
          }}>

          {children}
     </AuthContext.Provider>
     )
}
export const useAuth = () => useContext(AuthContext)