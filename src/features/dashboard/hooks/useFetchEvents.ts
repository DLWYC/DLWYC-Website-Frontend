import { api } from "@/config/api";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFetchAllEvents() {
  return useQuery({
    queryKey: ["allEvents"],
    queryFn: async () => {
      const res = await api.get("/events/all-events");
      return res.data;
    },
  });
}

export function useGetSingleEventData(eventId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      // 1. Try to read from cache first
      const cachedData = queryClient.getQueryData<{ events: any[] }>([
        "allEvents",
      ]);
      let eventList = cachedData?.events;

      // 2. If cache is wiped (on page reload), fetch all events from the API
      if (!eventList) {
        const res = await api.get("/events/all-events");
        // Access your array data safely depending on your backend structure
        eventList = res?.data?.events || res?.data?.event || [];
      }

      // 3. Find the single event from the list (Works for BOTH cached and freshly fetched data)
      const singleEvent = eventList?.find((event: any) => event._id === eventId);

      if (!singleEvent) {
        throw new Error("Event Not Found");
      }

      return singleEvent;
    },
    initialData: () => {
      // Seed data instantly if navigating from the dashboard list view
      const allEvent = queryClient.getQueryData<{ events: any[] }>([
        "allEvents",
      ]);
      return allEvent?.events?.find((event: any) => event._id === eventId);
    },

    staleTime: 1000 * 60 * 5, // Trust the data for 5 minutes before refetching background
    gcTime: 1000 * 60 * 10,
  });
}

export function useGetUserRegisteredEvents() {
  return useQuery({
    queryKey: ["userRegisteredEvents"],
    queryFn: async () => {
      const registeredEvents = await api.get("/events/userRegisteredEvents");
      return registeredEvents.data?.events;
    },
  });
}


export function usePaymentWebHook(reference: string){
  return useQuery({
    queryKey: ['transactionStatus'],
    queryFn: async () =>{
      const res = await api.get(`/events/verify-payment/${reference}`);
      console.log("Payment Webhook Response: ", res.data);
      return res.data?.status;
    }
  })
}