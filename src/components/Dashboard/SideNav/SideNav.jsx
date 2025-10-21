import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo.png";
import { useEffect, useState } from "react";

const SideNav = (prop) => {
  const navigate = useNavigate()
  const logOut = () =>{
    window.localStorage.setItem('token', '')
    navigate('/login')
  }

  


  


  return (
    <div
      className={`lg:basis-[20%] basis-[0%] lg:flex hidden flex-col h-full space-y-[30px] bg-[#091E54] fixed top-0 font-grotesk text-white`}
    >
      <div className="border-b p-4 flex items-center space-x-3">
        <div className="bg-[whitesmoke] w-[60px] h-[60px] p-1 rounded-full grid place-content-center">
          <img src={Logo} alt="" className="w-[50px]" />
        </div>
        <div className="font-rubik">
          <h3 className="text-[18px] font-bold truncate">
            DLWYC Registration Unit
          </h3>
          <p className="text-reddish font-extrabold italic text-[15px]">
            Admin
          </p>
        </div>
      </div>

      <ul className="divide-y divide-white">
        {prop.links.map((link) => (
          <a key={link.id} onClick={() => prop.handleNavLinks(link)} className="cursor-pointer">
            <li
              className={`py-4 px-3 ${link.link == prop.hashValue ? "bg-yellow" : ""}`}
            >
              {link.title}
            </li>
          </a>
        ))}
      </ul>

      <ul className="absolute bottom-9 w-full">
        <li onClick={logOut} className={`cursor-pointer py-4 px-3 text-yellow font-extrabold`}>Log Out</li>
      </ul>
    </div>
  );
};

export default SideNav;
