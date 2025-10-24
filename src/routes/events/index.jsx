import { createFileRoute } from '@tanstack/react-router'
import EventCard from "@/components/Cards/Event"
import EventData from "@/data/Events"
import Header from "@/components/Header/Header"



export const Route = createFileRoute('/events/')({
  component: Events,
})

function Events() {
  return(
      <>
          <div className="">
              <Header text='Our Events' />

            <div className="grid gap-6 lg:grid-cols-2 lg:p-10 p-4 bg-[#eae7fd94]">
                {EventData.map(event=>(
                  <div className="" key={event.id}>
                  <a href={`/events/${event.id}`}>
                  <EventCard  title={event.title} date={event.date} description={event.description} image={event.image} link={'/registration'} id={event.id} position='lg:flex'  />
                  </a>
                  </div>
                ))}
            </div>
          </div>

        </>
     )
}
