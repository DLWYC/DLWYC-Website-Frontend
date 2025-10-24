import { useState } from "react";
import { Info } from "../../components/Info/Info";
import axios from "axios";
import Alert from "../Alert/Alert";
import { useNavigate } from "react-router-dom";

export const InfoCard = (e) => {
  const [checkStatus, setCheckStatus] = useState(e.checkStatus);
  // const [error, setError] = useState(true)
  const currentLocation = location.pathname
  const navigate = useNavigate()
  const markAttendee = async (attendee) => {
    try {
      const {data} = await axios.post('https://api.dlwyouth.org/api/attendees', attendee)
      // const {data} = await axios.post('http://localhost:5000/api/attendees', attendee)
        setCheckStatus(true);
      if(data){
        navigate({to: currentLocation})
      }
      console.log(data.data.checkStatus)
      
    } catch (error) {
      console.log(error)
      // setError(true)      
        setCheckStatus(false);
    }

    // if (attendecheckStatus == false) {
    //   console.log("false");
    // } else {
    //   console.log("true");
    // }
  };

  return (
    <>
      <li
        key={e.uniqueId}
        className={`col-span-1 divide-y divide-gray-200 border border-[#f2f2f22e] overflow-hidden rounded-lg ${checkStatus ? 'bg-[#5d5d5d63] cursor-not-allowed' : 'bg-primary-main shadow-[0, 5px, 30px, rgba(0,0,0,0.1)]'}`}
      >
        <div className="flex w-full items-center justify-between space-x-6 p-6">
          <div className="flex-1 truncate">
            {/* Info */}
            <Info label="Unique ID" detail={e.uniqueId} checkStatus={checkStatus} />
            <Info label="Full Name" detail={e.name} checkStatus={checkStatus} />
            <Info label="Email" detail={e.email} checkStatus={checkStatus} />
            <Info label="Room Name" detail={e.hostel} checkStatus={checkStatus} />
            {/* Info */}

            <p className="mt-1 ">{}</p>
          </div>

          <img
            className="h-10 w-10 flex-shrink-0 grid place-content-center"
            src={e.logo}
          />
        </div>
        <div>
          <div className="-mt-px flex divide-x divide-gray-200">
            <div className="flex w-0 flex-1">
              <button
                onClick={() => {
                  if(!checkStatus){
                    markAttendee(e)
                  }
                }}
                className={`relative -mr-px inline-flex w-0 flex-1 border-none items-center justify-center gap-x-3  py-4 text-[15px] font-semibold text-gray-900  ${
                  checkStatus == true
                    ? "cursor-not-allowed text-white"
                    : "bg-[white] hover:bg-reddish hover:text-white transition-all"
                } `}
              >
                {checkStatus ? 'Checked' : 'Check-In'}
              </button>
            </div>
          </div>
        </div>
      </li>

      {/* <Alert
            status={error}
            header={"Error Occured!"}
            text={
              "Error Connecting with the server. Please Reach out to the Technical Unit"
            }
          /> */}
    </>
  );
};
