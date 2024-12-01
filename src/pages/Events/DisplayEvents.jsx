// import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import axios from "axios";
// import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { useEffect, useState } from "react";
import EventsData from "../../data/Events";
import NavBar from "../../components/Nav_Bar/Nav_Bar";

const DisplayEvents = () => {
  const [events, setEvents] = useState([""]);
  const { eventId } = useParams();

  useEffect(() => {
    const eventDetail = EventsData.find((event) => event.id == eventId);
    if (eventDetail) {
      setEvents(eventDetail);
    } else {
      // console.log("Event not found");
      setEvents([]);
    }
  }, [eventId]);

  return (
     <>
     <NavBar />


    <div className="flex place-content-center flex-col relative px-[20px] lg:px-[60px]">
    
    <div className="lg:px-0 lg:flex lg:flex-col mt-28 w-full  " key={events.id}>
              <a
                href="/events"
                className="px-3 py-3 lg:w-[15%] w-[50%] text-center text-gray-100 bg-reddish flex items-center justify-center rounded"
              >
                {/* <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> */}
                Back
              </a>
            </div>

      <div className=" flex place-content-center  ">
      
        <div className="mt-6 w-full">
          <div className="mb-4 md:mb-0 w-full mx-auto relative">

            <div className="flex justify-center items-center">
              <img
                src={events.image}
                alt={events.image}
                className="object-contain lg:rounded aspect-[1.4]"
              />
            </div>
          </div>



          <div className="flex flex-col lg:flex-row ">
            <div className="mt-12 leading-[2.2] tracking-[1px] text-gray-600 w-full text-balance break-words ">
              <p className="pb-6 " style={{ whiteSpace: 'pre-wrap' }}>{events.description}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
      <Footer />
    </>
  );
};

export default DisplayEvents;
