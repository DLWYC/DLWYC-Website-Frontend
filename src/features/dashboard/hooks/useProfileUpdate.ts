import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "@/config/api";
import { toast } from "react-toastify";

export function useProfileImageUploader() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userImage: File) => {
      const formData = new FormData();
      formData.append("file", userImage);
      const res = await api.patch("/user/uploadProfileImage", formData);
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(res.message ?? "Profile Image Updated Successfully!");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.error?.error ||
        error?.response?.data?.message ||
        "Profile Image Update failed. Please try again.";
      toast.error(msg);
    },
  });
}

// Define the shape of data your form uses
interface BasicInformation {
  fullName: string;
  age: string | number;
  archdeaconry: string;
  parish: string;
  occupation: string;
  email: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (formData: BasicInformation) => {
      // Map frontend 'occupation' to backend 'profession'
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        age: Number(formData.age),
        archdeaconry: formData.archdeaconry,
        parish: formData.parish,
        profession: formData.occupation,
      };

      const res = await api.patch("user/profile/update", payload);
      return res.data;

    },
    onSuccess: (data) => {
      // 1. Tell TanStack Query to refetch user data everywhere on the site
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      // 2. Optional: If you want to flash a success state or redirect somewhere using TanStack Router
      navigate({ to: '/dashboard' });

      toast.success(data.message || "Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred while saving.");
    },
  });
}
