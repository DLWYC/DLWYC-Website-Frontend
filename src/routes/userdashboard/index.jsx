import { createFileRoute, Link} from '@tanstack/react-router'
import { Card, CardContent } from "@/components/ui/card"
import {DashboardCards} from "@/data/Dashboard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarClockIcon, Calendar as CalenderIcon, MapPin, TimerIcon } from 'lucide-react'
import UserProfileImage from '@/components/UserProfileImage/UserProfileImage'
import { Calendar } from "@/components/ui/calendar"
import { useEffect, useState } from 'react'
import { formatDate } from 'date-fns/format'
import NotFound from '@/assets/Dashboard/notfound.png'
import {useAuth} from '@/lib/AuthContext'
import { useQueryClient } from '@tanstack/react-query'


export const Route = createFileRoute('/userdashboard/')({
  component: UserDashboard,
})



function UserDashboard() {
  const {userData, isLoadingUserData, allEvent, userRegisteredEvents, fetchingAllEvents, errorLoadingEvents} = useAuth()
  const [date, setDate] = useState(new Date())
  const [filteredEvents, setFilteredEvents] = useState([]);
  



  // Load All Events FIrst
useEffect(() => {
  setFilteredEvents(allEvent);
}, [allEvent]);


  // Handle Calendar Filtering
const handleFilter = () => {
      if (!date) {
    setFilteredEvents(allEvent);
    return
  }
  const selectedDateString = formatDate(date, "yyyy-MM-dd");
  const newFilteredEvents = allEvent.filter(event => {
    const eventDate = event.eventDate.split("T")[0]
    const eventDateString = formatDate(eventDate, "yyyy-MM-dd");
    return eventDateString == selectedDateString;
  });
  setFilteredEvents(newFilteredEvents);
};

// console.log(filtere)





  return (
     <div className="">
      {/* Home Dashbaord inner Content */}
             <div className="pt-4 space-y-4">
               <div className="rounded-[5px] border text-primary-main px-5 py-3 flex flex-wrap lg:flex-row flex-col lg:items-center">
                <UserProfileImage imageWidth={60} className={`lg:flex hidden`} />
                <div className="flex justify-center flex-col lg:px-5 font-rubik gap-2">
                <h3 className="lg:text-[30px] text-[20px] font-[500] flex items-center flex-wrap gap-2">Welcome  
                  <span>{ isLoadingUserData ? <span className="loader"></span> : userData?.fullName} </span>
                 </h3>
                <div className='flex lg:flex-row flex-col lg:gap-9'>
                <p className='text-[#64748B] text-[14px] flex items-center'>Email:  
                 { isLoadingUserData ? <span className="loader"></span> : userData?.email}
                </p>
                <p className='text-[#64748B] text-[14px] flex items-center'>Unique ID:  
                 { isLoadingUserData ? <span className="loader"></span> : userData?.uniqueId}
                </p>
                </div>
                </div>
               </div>
     
     
             {/* Top Sector */}
                <div className="flex  space-y-2 ">
                <div className="p-1 basis-[100%] grid lg:grid-cols-2 gap-4  font-inter">
                {DashboardCards.map((_, index) => (
                           <Card key={index} className="border border-[#e8e8e8] rounded-[5px] overflow-hidden">
                             <CardContent className="flex justify-center space-y-2 flex-col px-[20px] py-[15px] bg-white ">
                             
                               <h3 className="text-rubik text-[#64748B] text-[14px] flex items-center gap-2"> {_.icon && <_.icon className={`w-[15px]`} color={`${_.IconColor}`} />} {_.text}</h3>
                               <p className="text-[24px] font-[600] tracking-[1.3px] text-[#1E293B]">
                               {fetchingAllEvents ? ( <span className="loader"></span> ) : ( index === 0 ? (allEvent?.length || 0) :  index === 1 ? (userRegisteredEvents?.length || 0) : 0 )}
                               </p>
                             </CardContent>
                           </Card>
                ))}
                         </div>
                </div>
             {/* Top Sector */}



             {/* Upcoming Events */}
             <div className=" flex lg:flex-row flex-col p-1 gap-5 font-inter">
                <div className="basis-[70%] border bg-white px-6 py-6 space-y-3 ">                  
                <div className=" flex justify-between items-center">
                  <h3 className="text-[#64748B] text-[15px] font-[400]">Upcoming Events</h3>
                  <p className='text-[#64748B] text-[14px] flex items-center gap-2'>{filteredEvents?.length} Events <CalenderIcon className='w-[13px]' /></p>
                </div>
                  <ScrollArea className={`${filteredEvents?.length === 0 ? 'flex items-center justify-center' : ''} h-[420px] w-full`}>
                    <div className='space-y-4'>
                               {/* { : ''} */}

                  {fetchingAllEvents ? <span className="loader"></span> : errorLoadingEvents ? 
                    <div className="border flex flex-col justify-center items-center h-[410px] space-y-5">
                    <img src={NotFound} alt="" className='w-[90px]' />
                    <p className='text-red-500'>No Upcoming Event</p>
                    </div>
                   : filteredEvents?.length === 0 ? ( 
                    <div className="border flex flex-col justify-center items-center h-[410px] space-y-5">
                    <img src={NotFound} alt="" className='w-[90px]' />
                    <p className='text-red-500'>Sorry No Event For The Day</p>
                    </div>
                  ):filteredEvents?.map((_, index) => (
                             <div key={index} className="flex border justify-center space-y-2 flex-col rounded-[5px] px-[20px] py-[15px] bg-white border-[#e8e8e8]"> 
                             {console.log("Front ednd", _.paymentStatus)}
                              

                                <div className="flex justify-between items-center">
  <h3 className="text-rubik text-[#1E293B] text-[17px] font-[500] flex items-center gap-2">
    {_.eventTitle}
  </h3>
  <p className="text-rubik text-[#1E293B] text-[13px] flex items-center">
    <span className={`${_.paymentStatus == 'success' ? 'text-[green]' : 'text-[red]'}`}>
      {_.paymentStatus ? _.paymentStatus : "Not Registered"}
    </span>
  </p>
</div>

                               <div className="flex flex-wrap items-center lg:gap-5 gap-2">
                                <p className="text-[#64748B] text-[14px] flex items-center gap-1">  <CalendarClockIcon className={`w-[14px]`} />{_.eventDate.split("T")[0]}</p>
                                <p className="text-[#64748B] text-[14px] flex items-center gap-1">  <TimerIcon className={`w-[14px]`} />{_.eventTime}</p>
                                <p className="text-[#64748B] text-[14px] flex items-center gap-1"> <MapPin className={`w-[14px]`} />{_.eventLocation}</p>
                               </div>
                             
                             
                             <div className="lg:flex lg:justify-end grid text-center lg:mt-0 mt-3">
                              <Link to={`event?eventId=${_._id}`} disabled={_.paymentStatus == 'success' ? true : false} className={`${_.paymentStatus == 'success' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-primary-main hover:text-white'}  text-[14px] transition-all duration-150 border border-primary-main  px-[30px] py-[7px] `}>Register</Link>
                             </div>
                             </div>

                  ))}
                           </div>
                </ScrollArea> 
                  
                </div>



                <div className="basis-[30%] h-fit flex flex-col space-y-3">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-lg border w-full"
                  captionLayout="dropdown"
                />

                  <div className="border space-y-3 grid">
                    <p>Select Date To Find Event For That Day</p>
                  <button className='text-[14px] transition-all duration-150 border border-primary-main hover:bg-primary-main hover:text-white px-[30px] py-[7px] cursor-pointer' 
                  onClick={handleFilter}
                  >Find Events</button>
                  </div>
                </div>
             </div>
             {/* Upcoming Events */}
     </div>
     </div>
  )
}
