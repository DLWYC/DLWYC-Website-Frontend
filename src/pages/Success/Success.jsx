import { FaCheckCircle } from "react-icons/fa";

const Success = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-[#8080801f]">
      <div className="basis-[40%] rounded-lg p-[40px] bg-white flex flex-col items-center text-center space-y-3">
        <FaCheckCircle className="text-[#44d390e8] text-[120px]" />
        <p className="font-rubik tracking-wide text-[20px]">
          You Have Successfully <br /> Registered For This Year Camp
        </p>
        <div className="grid place-content-center">
          <a
            href="/"
            className="bg-[#393f8ba1] text-white font-rubik tracking-wide p-eventbutton rounded-full hover:bg-[#44d390e8] transition-all"
          >
           Go Back
          </a>
        </div>
      </div>
    </div>
  );
};

export default Success;
