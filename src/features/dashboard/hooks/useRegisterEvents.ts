import { api } from "@/config/api";
import { useMutation } from "@tanstack/react-query";

import { toast } from "react-toastify";

export function useVerifyCode(eventId, code) {
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

export function useFreeEventRegistration(eventId) {

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
