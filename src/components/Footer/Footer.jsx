import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa"
import FooterLogo from "../../assets/main_logo.svg"




const Footer = () =>{
     return(
          <div className=" bg-yellow grid lg:grid-cols-4 font-grotesk lg:p-[50px] p-[20px] gap-4 text-white">
               <div className="flex flex-col justify-center">
                    <img src={FooterLogo} alt="" className="" />
               </div>

               <div className="flex flex-col justify-between space-y-4 ">
                    <h1 className="text-[18px] font-medium text-text-primary">Contact Us</h1>
                    <ul className="space-y-3">
                         <li className=""> <span className="text-reddish">Email:</span> <a href="mailto:dlwyouth@gmail.com">dlwyouth@gmail.com</a> </li>
                         <li><span className="text-reddish">Address:</span> 103 Oduduwa Cresent, GRA, Ikeja, Lagos State, Nigeria.</li>
                    </ul>
               </div>

               <div className="flex justify-between flex-col lg:pl-6 space-y-4">
                    <h1 className="text-[18px] font-medium text-text-primary ">Quick Links</h1>
                    <ul className="space-y-3">
                         <li className="text-[15px]"> <a href="/about">About Us</a> </li>
                         <li className="text-[15px]"> <a href="/events">Events</a> </li>
                         <li className="text-[15px]"> <a href="/registration">Registration</a> </li>
                    </ul>
               </div>


               <div className="flex flex-col justify-between space-y-3">
               <h1 className="text-[18px] font-medium text-text-primary ">Socials</h1>

               <div className="flex gap-3">
                    <a href="https://www.instagram.com/dlwyouth/" className="w-[40px] h-[40px] rounded-full grid place-content-center bg-[#06061a25]" target="_blank"> 
                     <FaInstagram className="text-[20px]"/>    
                    </a>
                    
                    <a href="https://www.facebook.com/dlwyouthchaplaincy/" className="w-[40px] h-[40px] rounded-full grid place-content-center bg-[#06061a25]" target="_blank">
                     <FaFacebookF className="text-[20px]"/>    

                    </a>

                    <a href="https://www.youtube.com/@dlwyouth9725" className="w-[40px] h-[40px] rounded-full grid place-content-center bg-[#06061a25]" target="_blank">
                     <FaYoutube className="text-[20px]"/>    

                    </a>
               </div>
               
               </div>   
          </div>
     )
}

export default Footer