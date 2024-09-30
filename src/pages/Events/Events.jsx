import EventCard from "../../components/Cards/Event"
import EventData from "../../data/Events"
import NavBar from "../../components/Nav_Bar/Nav_Bar"
import Footer from "../../components/Footer/Footer"
import Header from "../../components/Header/Header"

const Events = () => {
     return(
      <>
      <NavBar />
          <div className="">
              <Header text='Our Events' />

            <div className="grid gap-6 lg:grid-cols-2 lg:p-10 p-4 bg-[#eae7fd94]">
                {EventData.map(event=>(
                  <div className="" key={event.id}>
                  <a href={`http://localhost:5173/events/${event.id}`}>
                  <EventCard  title={event.title} date={event.date} description={event.description} image={event.image} link={'/registration'} id={event.id} position='lg:flex'  />
                  </a>
                  </div>
                ))}
            </div>
          </div>
      <Footer />

        </>
     )
};

export default Events;
