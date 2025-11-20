import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../lib/AuthContext'
import MultiSteps from '../../../components/MultiStep/MultiStep'

export const Route = createFileRoute('/userdashboard/event/$id')({
  component: SingleEvent,
})

function SingleEvent() {
  const { userData, userRegisteredEvents } = useAuth()
  const queryClient = useQueryClient()
  const { id } = Route.useParams()
  const [cachedEvent, setCachedEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get cached events data
    const events = queryClient.getQueryData(['allEvent', userData?.uniqueId, userRegisteredEvents])
    console.log("Cached Events: ", events, "user Details", userData, "User Registered Events: ", userRegisteredEvents, "id:", id)
    // Check if events exists and is an array before using .find()
    if (events && Array.isArray(events)) {
      const event = events.find((event) => event?._id === id)
      setCachedEvent(event || null)
    } else {
      setCachedEvent(null)
    }
    
    setLoading(false)
  }, [queryClient, id, userData?.uniqueId, userRegisteredEvents])

  console.log('Cached Event: ', cachedEvent)

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#f4f7fa] py-[30px] font-rubik border">
        <p className="text-center">Loading event details...</p>
      </div>
    )
  }

  // Event not found state
  if (!cachedEvent) {
    return (
      <div className="bg-[#f4f7fa] py-[30px] font-rubik border">
        <p className="text-center text-red-500">
          Event not found. Please make sure the event exists.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[#f4f7fa] py-[30px] font-rubik border">
      {/* Uncomment when needed */}
      {/* <p className='text-[18px] border border-red-500'>
        Register For: <span className='text-primary-main font-bold'>{cachedEvent.eventTitle}</span>
      </p> */}
      
      <div className="flex items-center basis-[50%]">
        <MultiSteps userData={userData} eventDetails={cachedEvent} />
      </div>
    </div>
  )
}