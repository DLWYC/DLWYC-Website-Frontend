import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "@tanstack/react-router";
import { api } from "@/config/api";
import { toast } from "react-toastify";

// interface RegisterCredentials {
//   fullName: string;
//   email: string;
//   password: string;
//   phoneNumber: string;
//   gender: string;
//   archdeaconry: string;
//   parish: string;
//   age: string;
//   profilePicture?: string;
//   profession: string;
// }

export function useProfileImageUploader() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userImage: File) => {
      const formData = new FormData();
      formData.append("file", userImage);
      console.log("Form Data: ", userImage, formData)
      const res = await api.patch("/user/uploadProfileImage", formData);
      console.log("Response: ", res.data)
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
