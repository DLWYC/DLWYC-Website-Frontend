import SideNav from "../../components/Dashboard/SideNav/SideNav";
import InnerContent from "../../components/Dashboard/InnerContent/InnerContent";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";




const Dashboard = () => {
  const navigate = useNavigate();

  const links = [
    { id: 1, title: "Dashboard", link: "#index" },
    { id: 2, title: "Attendance", link: "#attendance" },
    { id: 3, title: "Settings", link: "#settings" },
  ];

  // // const hash = location.hash
  const [hash, setHash] = useState(window.location.hash || '#index');
  window.localStorage.setItem('hashValue', hash)
 const token = window.localStorage.getItem('token')
 if(!token || token == "" ){
   navigate('/login')
 }

  useEffect(() => {
    // Redirect to the first link when the page loads or when the hash changes  
      navigate(`/dashboard/#index`);
    }, [navigate, token]);
    
  const handleNavLinks = (e) => {
    setHash(e.link)
  };

  useEffect(()=>{
    window.location.hash = hash
  }, [hash])


  
  const currentLocation = window.localStorage.getItem('hashValue')
  useEffect(()=>{
    console.log(currentLocation)
  }, [currentLocation])

  return (
    <div className="flex relative">
      <SideNav links={links} hashValue={hash} handleNavLinks={handleNavLinks} />
      <div className="whitespace lg:basis-[23.4%]"></div>
      <InnerContent hashValue={hash} />
    </div>
  );
};

export default Dashboard;
