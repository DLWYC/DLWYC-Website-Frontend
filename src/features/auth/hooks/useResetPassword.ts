import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "@/config/api";
import { toast } from "react-toastify";

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      const res = await api.post(
        `/auth/resetPassword?token=${credentials.token}`,
        credentials,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password Reset Successfully")
      navigate({ to: "/login" });
    },
    onError: (error: any) => {
      const status = error?.response?.status;

      if (status === 410) {
        toast.error("Reset link has expired. Please request a new one.");
        navigate({ to: "/forgotPassword" });
        return;
      }

      toast.error(error?.response?.data?.error || "Something went wrong.");
    },
  });
}
