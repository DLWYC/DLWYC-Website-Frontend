import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserIcon } from "lucide-react"
import { useAuth } from "../../lib/AuthContext"


const UserProfileImage = ({imageWidth, className}) =>{
  const {userData} = useAuth()
  return(
 <Avatar
    style={{
      width: `${imageWidth}px`,
      height: `${imageWidth}px`,
    }}
    className={`flex place-content-center items-center border ${className}`}
  >
    <AvatarImage src={userData?.profilePicture} loading="lazy" />
        <AvatarFallback className="border-primary-main"><UserIcon color="#091e54" /></AvatarFallback>

  </Avatar>
  )
}

export default UserProfileImage