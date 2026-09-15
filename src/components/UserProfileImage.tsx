import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";


const UserProfileImage = ({ imageWidth, className }: { imageWidth: number; className?: string }) => {
  const {data: user} = useAuthUser()
  return (
    <Avatar
      style={{ width: `${imageWidth}px`, height: `${imageWidth}px` }}
      className={`flex place-content-center items-center ${className}`}
    >
      <AvatarImage src={user.profilePicture} loading="lazy" />
      <AvatarFallback className="border-primary-main">
        <UserIcon color="#091e54" />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserProfileImage;
