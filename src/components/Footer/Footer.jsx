import { FaFacebook, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa"
import FooterLogo from "../../assets/main_logo.svg"




const Footer = () =>{
     return(
          <div className="lg:h-[40vh] bg-yellow grid lg:grid-cols-4 font-grotesk p-6 gap-4 text-white">
               <div className="flex flex-col justify-center">
                    <img src={FooterLogo} alt="" className="" />
               </div>

               <div className="flex flex-col justify-center space-y-4 ">
                    <h1 className="text-[18px] font-medium ">Contact Us</h1>
                    <ul className="space-y-3">
                         <li className="">Email: <a href="mailto:dlwyouth@gmail.com">dlwyouth@gmail.com</a> </li>
                         <li>Address: 103 ODUDUWA CRESCENT, GRA, IKEJA, LAGOS STATE, NIGERIA.</li>
                    </ul>
               </div>

               <div className="flex justify-center flex-col lg:pl-6 space-y-4">
                    <h1 className="text-[18px] font-medium ">Help</h1>
                    <ul className="space-y-3">
                         <li className="text-[15px]"> <a href="/faqs">FAQS</a> </li>
                         <li className="text-[15px]"> <a href="/about">About Us</a> </li>
                    </ul>
               </div>


               <div className="flex flex-col justify-center space-y-3">
               <h1 className="text-[18px] font-medium ">Socials</h1>

               <div className="flex gap-3">
                    <a href="https://www.instagram.com/dlwyouth/" className="w-[40px] h-[40px] rounded-full grid place-content-center bg-[#06061a25]" target="_blank"> 
                     <FaInstagram className="text-[20px]"/>    
                    </a>
                    
                    <a href="https://www.facebook.com/dlwyouthchaplaincy/" className="w-[40px] h-[40px] rounded-full grid place-content-center bg-[#06061a25]" target="_blank">
                     <FaFacebookF className="text-[20px]"/>    

                    </a>
               </div>
               
               </div>   
          </div>
     )
}

export default Footer