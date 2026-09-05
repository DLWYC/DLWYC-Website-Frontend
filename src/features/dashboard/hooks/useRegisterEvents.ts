import { api } from "@/config/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";


import { toast } from "react-toastify";

export function useVerifyCode(eventId: any, code: any) {
  return useMutation({
    mutationFn: async () => {
      console.log({ eventId: eventId, code: code });
      const res = await api.post("/events/verify-code", { eventId, code });
      console.log("Log: ", res.data);
      return res.data;
    },
    onError: (error: any) => {
      console.log("error: ", error.response.data.error);
      toast.error(`Error: ${error.response.data.error}`);
    },
  });
}

export function useFreeEventRegistration(eventId: any) {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("events/free", { eventId });
      console.log("REsponse Frm API: ", res.data);
      return res.data;
    },
    onSuccess: (data: any) => {
      console.log(" THis is the response from the API: ", data);
      toast.success(`Success: ${data?.message}`);
    },
    onError: (error: any) => {
      console.log("Error: ", error?.response?.data?.error);
      toast.error(error?.response?.data?.error);
    },
  });
}

export function useInitalizePaymentTransaction() {
  return useMutation({
    mutationFn: async (paymentRequest: {
      email: string;
      amount: number;
      reference: string;
      eventId: string;
      amountOfPeople: number;
    }) => {
      const res = await api.post(
        "events/initializeTransaction",
        paymentRequest,
      );
      return res.data
    },
    onSuccess: (data: string | undefined) => {
      const authUrl = data?.data?.data?.authorization_url
      console.log("Payment initialized: ", authUrl);
      window.location.href = authUrl;
    },
    onError: (error: any) => {
      toast.error(`${error?.response?.data.error}`);
      // return error?.response;
    },
  });
}


