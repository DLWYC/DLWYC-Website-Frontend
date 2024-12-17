import { useEffect, useState } from "react";
import Logo from "../../assets/main_logo.svg";
import mainLogo from "../../assets/logo.png";
import { InfoCard } from "../../components/Info/infoCard";
// import { Attendees } from "../../data/attendees";
import axios from "axios";

const RegistrationUnit = () => {
  const [Attendees, setAttendees] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [foundUser, setFoundUser] = useState(null);

  const fetchData = async () => {
    // const campers = await axios.get("http://localhost:5000/api/attendees");
    const campers = await axios.get("https://api.dlwyouth.org/api/attendees");
    if (campers.data) {
      setAttendees(campers.data);
    } else [setAttendees([])];
  };

  useState(async () => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData(); // Fetch data every 2 seconds
    }, 1000);

    return () => {
      clearInterval(intervalId); // Clear the interval on component unmount
    };
  }, []);

  useEffect(() => {
    const attendee = Attendees.filter((attendee) =>
      attendee.uniqueID.toLowerCase().includes(searchUser.toLowerCase())
    );
    setFoundUser(attendee);
  }, [searchUser, Attendees]);

  //   console.log(Attendees, searchUser);

  return (
    <div className=" p-4 ">
      {/* The Main Section - TOP SECTION */}
      <div className=" relative top-auto w-full flex flex-col items-center font-grotesk bg-white z-[20] border-b p-2 ">
        {/* search & title */}
        <div className="w-full flex flex-col space-y-1  ">
          <b className="uppercase  p-1 lg:text-[30px] text-[20px] font-rubik-moonrock tracking-wider text-primary-main ">
            All Registered Campers
          </b>

          <div className="text-[15px] lg:p-1 p-2 w-full ">
            <div className="flex gap-3 items-center">
              <label
                htmlFor="search"
                className="text-reddish font-[500] text-[17px] tracking-[0.5px] lg:basis-[12%] basis-[15%]"
              >
                Search By:
              </label>
              <input
                onInput={(e) => setSearchUser(e.target.value)}
                type="text"
                placeholder="Enter The Campers Unique ID"
                name="search"
                className="border-b-2 tracking-[0.3px] border-primary-main w-full outline-none pt-2 pb-1 px-0"
              />

              {/* Submit Button */}
              {/* <button
                type="submit"
                className="rounded-[5px] bg-reddish text-white w-[20%] p-3 grid place-content-center hover:bg-blue-900 transition-all"
              >
                Search
              </button> */}
              {/* Submit Button */}
            </div>

            {/* New Attendees */}
            <div className="relative w-full p-3 mt-3 bg-[#1e1e1e21] rounded-[10px] lg:flex gap-4">
              <p>Are there new attendees? Register them here:</p>
              <a href="/registration" className="text-reddish underline">
                Click Here
              </a>
            </div>
            {/* New Attendees */}
          </div>
        </div>
        {/* search & title */}
      </div>
      {/* The Main Section - TOP SECTION */}

      {/* The Main Section - Bottom SECTION */}
      <ul
        role="list"
        className="relative grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2 p-[20px] font-grotesk bg-[#40404011]"
      >
        {/* All Together */}

        {Attendees.length == 0
          ? "No Registered Users Found"
          : searchUser == "" || searchUser.length == 0
          ? Attendees.map((person) => (
              <InfoCard
                uniqueId={person.uniqueID}
                name={person.fullName}
                email={person.email}
                logo={mainLogo}
                key={person.uniqueID}
                checkStatus={person.checkStatus}
                hostel={person.allocatedRoom}
              />
            ))
          : foundUser.length <= 0
          ? "Sorry No User Found"
          : foundUser.map((person) => (
              <InfoCard
                uniqueId={person.uniqueID}
                name={person.fullName}
                email={person.email}
                logo={mainLogo}
                key={person.uniqueID}
                checkStatus={person.checkStatus}
                hostel={person.allocatedRoom}
              />
            ))}

        {/* All Together */}
      </ul>
      {/* The Main Section - Bottom SECTION */}
    </div>
  );
};

export default RegistrationUnit;
