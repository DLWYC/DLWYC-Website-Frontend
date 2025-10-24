import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import UserProfileImage from '@/components/UserProfileImage/UserProfileImage'
import {SuperAdminDashboardCards} from "@/data/Dashboard"
import { Card, CardContent } from "@/components/ui/card"




export const Route = createFileRoute('/superadmin/')({
  component: SuperAdminDashboard,
})

function SuperAdminDashboard() {
   
    const [allEvent, setallEvent] = useState([]);
    const [userRegisteredEvents, setuserRegisteredEvents] = useState([]);
      const recentActivity = [
    { user: 'Timilehin', action: 'Registered for Mind Education', time: '2 mins ago' },
    { user: 'John Doe', action: 'Completed payment', time: '15 mins ago' },
    { user: 'Jane Smith', action: 'Registered for Leadership Summit', time: '1 hour ago' },
    { user: 'Admin', action: 'Created new event', time: '2 hours ago' }
  ];
  
  return (
    <div className="space-y-6 border border-red-500">
               {/* Welcome Text */}
            <div className="rounded-[5px] border text-primary-main  px-5 py-3 flex flex-wrap lg:flex-row flex-col lg:items-center">
                <UserProfileImage imageWidth={60} />
                <div className="flex justify-center flex-col lg:px-5 font-rubik">
                <h3 className="text-[30px] font-[500] flex items-center">Welcome back, Admin🏫
                 </h3>
                
                </div>
               </div>
               {/* Welcome Text */}


            {/* Top Sector */}
            <div className="flex  space-y-2 ">
              <div className="p-1 basis-[100%] grid lg:grid-cols-3 gap-4  font-inter">
              {SuperAdminDashboardCards.map((_, index) => (
                        <Card key={index} className="border border-[#e8e8e8] rounded-[5px] overflow-hidden">
                          <CardContent className="flex justify-center space-y-2 flex-col px-[20px] py-[15px] bg-white ">
                          
                            <h3 className="text-rubik text-[#64748B] text-[14px] flex items-center gap-2"> {_.icon && <_.icon className={`w-[15px]`} color={`${_.IconColor}`} />} {_.text}</h3>
                            <p className="text-[24px] font-[600] tracking-[1.3px] text-[#1E293B]">
                            {/* {fetchingAllEvents ? ( <span className="loader"></span> ) :  */}
                            {
                            ( index === 0 ? (allEvent?.length || 0) :  index === 1 ? (userRegisteredEvents?.length || 0) : 0 )
                            }
                            </p>
                          </CardContent>
                        </Card>
              ))}
                      </div>
            </div>
                  {/* Top Sector */}


                  {/* Recent Activity */}
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          <span className="font-semibold">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
                  {/* Recent Activity */}
               
          </div>
  )
}
