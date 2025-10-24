import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute,  } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../lib/AuthContext'
import MultiSteps from '../../../components/MultiStep/MultiStep'



export const Route = createFileRoute('/userdashboard/event/$id')({
  component: SingleEvent,
})

function SingleEvent() {
     const {userData, userRegisteredEvents} = useAuth()
     const queryClient = useQueryClient()
     const {id}   = Route.useParams()
     const [cachedEvent, setCachedEvent] = useState('')

useEffect(() => {
const events = queryClient.getQueryData(['allEvent', userData?.uniqueId, userRegisteredEvents])
const event = events?.find((event) => event._id === id);
setCachedEvent(event)
  }, [queryClient]);

  console.log('sdsdfaaaaaaa: ', cachedEvent)

  return(
     <div className=" bg-[#f4f7fa]py-[30px] font-rubik border">

               {/* <p className='text-[18px] border border-red-500'>Register For: <span className='text-primary-main font-bold'>{cachedEvent.eventTitle}</span> </p> */}
               <div className="flex items-center basis-[50%]">
                    <MultiSteps userData={userData} eventDetails={cachedEvent} />
               </div>
     </div>
  )
}
