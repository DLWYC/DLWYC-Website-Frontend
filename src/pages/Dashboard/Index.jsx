import axios from "axios";
import { DashboardCard } from "../../components/Cards/dashboard";
import { useEffect, useState } from "react";

const MainDashboard = () => {
     const [totalAttendees, setTotalAttendees] = useState('')
     const [markedAttendees, setMarkedAttendees] = useState('')
     const [unMarkedAttendees, setUnMarkedAttendees] = useState('')
     const fetchData = async () =>{
          // const getTotal = await axios.get('http://localhost:5000/api/attendees')
          // const getMarkedAttendees = await axios.get('http://localhost:5000/api/attendees/markedAttendees')
          // const getUnMarkedAttendees = await axios.get('http://localhost:5000/api/attendees/unMarkedAttendees')
          const getTotal = await axios.get('https://api.dlwyouth.org/api/attendees')
          const getMarkedAttendees = await axios.get('https://api.dlwyouth.org/api/attendees/markedAttendees')
          const getUnMarkedAttendees = await axios.get('https://api.dlwyouth.org/api/attendees/unMarkedAttendees')

          if(getTotal.data){    
               setTotalAttendees(getTotal.data)
          }
          if(getMarkedAttendees.data){
               setMarkedAttendees(getMarkedAttendees.data)
          }
          if(getUnMarkedAttendees.data){
               setUnMarkedAttendees(getUnMarkedAttendees.data)
          }
     }
     useState(async () => {
          fetchData();
          const intervalId = setInterval(() => {
            fetchData(); // Fetch data every 2 seconds
          }, 1000);
      
          return () => {
            clearInterval(intervalId); // Clear the interval on component unmount
          };
        }, []);

  return (
    <div className="flex flex-col p-4">
      <b className="text-[30px] p-4 font-header uppercase text-yellow">
        Welcome DLWYC Registration Unit
      </b>

      <div className="grid lg:grid-cols-2 gap-3">
          <DashboardCard text={`Total Number Of Registered Campers:`} number={totalAttendees.length} />
          <DashboardCard text={`Total Number Of Marked Campers:`} number={markedAttendees.length} />
          <DashboardCard text={`Total Number Of Unmarked Campers:`} number={unMarkedAttendees.length} />
      </div>
    </div>
  );
};

export default MainDashboard;
