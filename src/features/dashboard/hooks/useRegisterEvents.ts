import { api } from "@/config/api";
import { useMutation } from "@tanstack/react-query";

import { toast } from "react-toastify";

export function useVerifyCode() {
  return useMutation({
    mutationFn: async ({
      eventId,
      code,
    }: {
      eventId: string;
      code: string;
    }) => {
      const res = await api.post("/events/verify-code", { eventId, code });
      return res.data;
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.response.data.error}`);
    },
  });
}

export function useFreeEventRegistration(eventId: any) {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("events/free", { eventId });
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success(`Success: ${data?.message}`);
    },
    onError: (error: any) => {
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
      return res.data;
    },
    onSuccess: (response: {
      data: { data: { authorization_url: string } };
    }) => {

      // Clean extraction with no errors
      const authUrl = response.data?.data?.authorization_url;

      if (authUrl) {
        window.location.href = authUrl;
      }
    },
    onError: (error: any) => {
      toast.error(`${error?.response?.data.error}`);
      // return error?.response;
    },
  });
}
