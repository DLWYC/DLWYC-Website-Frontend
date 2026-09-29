import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

const UserProfileImage = ({
  imageWidth,
  className,
}: {
  imageWidth: number;
  className?: string;
}) => {
  const { data: user } = useAuthUser();
  return (
    <Avatar
      style={{ width: `${imageWidth}px`, height: `${imageWidth}px` }}
      className={`flex place-content-center items-center ${className}`}
    >
      <AvatarImage
        src={user.profilePicture}
        loading="lazy"
        className="text-[20px] bg-primary-main text-white font-rubik"
      />
      <AvatarFallback className="text-[15px] bg-primary-main text-white font-rubik">
        {user?.fullName
          .split(" ")
          .map((part: any) => part[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserProfileImage;
