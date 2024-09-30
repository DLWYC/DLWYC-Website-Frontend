import { useState, useEffect, Fragment } from "react";
import Logo from "../../assets/main_logo.svg";
import dlw from "../../assets/registrationpage/dlw.jpeg";
import axios from "axios";
import Churches from "../../data/churches";
import Input from "../../components/Inputs/Inputs";
import {
  ageOptions,
  genderOptions,
  archdeaconryOptions,
  camperTypeOptions,
  denominationOptions,
} from "../../data/Inputs";
import { HandleData } from "../../utils/functions";
import { useNavigate } from "react-router-dom";
import { Transition } from "@headlessui/react";
// import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { FaExclamationCircle, FaRegTimesCircle } from "react-icons/fa";

export default function Registration() {
  // ## This it to get the values of the inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [archdeaconry, setArchdeaconry] = useState(null);
  const [parish, setParish] = useState(null);
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [camperType, setCamperType] = useState("");
  const [denomination, setDenomination] = useState("");
  const [churchList, setChurchList] = useState([]);
  // const [reference, setReference] = useState('');
  // const [accessCode, setAccessCode] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [disable, setDisable] = useState();
  const [regsitrationStatus, setRegsitrationStatus] = useState(true);
  const [regsitrationTextStatus, setRegsitrationTextStatus] = useState('Register');
  const [show, setShow] = useState(true);

  const userInput = {
    fullName,
    email,
    phoneNumber,
    age,
    gender,
    archdeaconry,
    parish,
    camperType,
    denomination,
  };


  // ## Handle Input Changes
  //   ## Submit Form Data
  const submitForm = async (e) => {
    e.preventDefault();
    window.localStorage.setItem('email', userInput.email)
    try {
      const registrationReponse = await axios.post(
        "http://localhost:5000/api/registration",
        userInput
      );
      console.log(registrationReponse);
      if (registrationReponse.data.message === "Registration Successful") {
        navigate("/registration/verify");
      } else {
        setRegsitrationStatus(false);
      }

      // });
    } catch (err) {
      console.log(err);
      setError(err.response.data.errors);
    }
  };


  // ## Handle Dropdown Changes
  useEffect(() => {
    setDisable(HandleData(userInput));
  }, [userInput]);

  useEffect(() => {
    //   ## Filter Parishes by Archdeaconry
    if (archdeaconry) {
      const handleArchdeaconryFilter = Churches.filter(
        (item) => item.archdeaconry === archdeaconry
      );
      const churches = handleArchdeaconryFilter.flatMap((churches) =>
        churches.churches.map((church) => ({
          value: church.name,
          label: church.name,
        }))
      );
      setChurchList(churches);
      setSelectedOption(null);
      setParish(null);
    } else {
      setChurchList([]);
      setSelectedOption(null);
      setParish(null);
    }
  }, [archdeaconry]);

  // Handle ArchdeaconryType
  useEffect(() => {
    if (denomination === "Anglican" && selectedOption) {
      setParish(selectedOption.value);
    } else if (denomination === "Non-Anglican") {
      setParish(null);
    } else {
      setParish(null);
    }
  }, [selectedOption, denomination]);

  // Handle Error Removal
  const removeError = (e) => {
    setError({ ...error, [e.target.name]: "" });
  };

  return (
    <div className="grid lg:p-3 p-0 relative h-full lg:grid-cols-2 lg:place-content-center font-rubik  ">
      <div className="rounded-lg flex  h-full flex-col space-y-2 lg:p-5 p-2 lg:basis-[50%] basis-full lg:justify-center relative  ">
        <div className="justify-between items-center lg:flex grid space-y-3">
          <img className="w-[250px] top-[10px]" src={Logo} alt="Logo" />
        </div>

        <div className="lg:text-[17px] font-normal font-rubik-moonrock text-primary-main flex justify-between">
          <h1>
            2024 <span className="text-red-600">Camp</span> Registration{" "}
          </h1>
          <p className="text-red-500 font-rubik-moonrock">
            {" "}
            <span className="text-primary-main ">Note:</span> All Input Fields
            Are To Be Filled
          </p>
        </div>
        {/* {success ? (<div className="rounded-xl text-white bg-green-500 p-3">Registration Successful</div>) : (<></>)} */}
        <form method="post" className="space-y-5 font-rubik ">
          <div className="space-y-3 ">
            {/* FirstName */}
            <div className="text-[15px] space-y-1">
              <Input
                // required
                error={error}
                // value={}
                removeError={removeError}
                onInput={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="Enter Full Name"
                name="fullName"
                label="Full Name"
              />
            </div>
            {/* FirstName */}

            {/* Email and Phone Number */}
            <div className="flex lg:flex-row flex-col lg:space-x-2 text space-y-3 lg:space-y-0">
              <Input
                // required
                error={error}
                // value={''}
                removeError={removeError}
                onInput={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter Email"
                name="email"
                label="Email"
                basis
              />
              <Input
                // required
                error={error}
                // value={''}
                removeError={removeError}
                onInput={(e) => setPhoneNumber(e.target.value)}
                type="text"
                placeholder="Enter Phone Number"
                name="phoneNumber"
                label="Phone Number"
                basis
              />
            </div>
            {/* Email and Phone Number */}

            {/* Age and Gender */}
            <div className="flex lg:flex-row flex-col lg:space-x-2 text space-y-3 lg:space-y-0">
              <Input
                // required
                error={error}
                // value={''}
                removeError={removeError}
                onInput={(e) => setAge(e.target.value)}
                name="age"
                label="Age"
                basis
                options={ageOptions}
              />
              <Input
                // required
                error={error}
                // value={''}
                removeError={removeError}
                onInput={(e) => setGender(e.target.value)}
                name="gender"
                label="Gender"
                basis
                options={genderOptions}
              />
            </div>
            {/* Age and Gender */}

            {/* Camper Type and Anglican Member */}
            <div className="flex lg:flex-row flex-col lg:space-x-2 text space-y-3 lg:space-y-0">
              <Input
                // required
                error={error}
                // value={''}
                removeError={removeError}
                onInput={(e) => setCamperType(e.target.value)}
                name="camperType"
                label="Camper Type"
                basis
                options={camperTypeOptions}
              />
              <Input
                // required
                error={error}
                // value={''}
                removeError={removeError}
                onInput={(e) => setDenomination(e.target.value)}
                name="denomination"
                label="Denomination"
                basis
                options={denominationOptions}
              />
            </div>
            {/* Camper Type and Anglican Member */}

            {/* Archdeaconry and Parish */}
            <div className="flex lg:flex-row flex-col lg:space-x-2 text space-y-3 lg:space-y-0">
              <Input
                // required
                error={error}
                // value={}
                removeError={removeError}
                onInput={(e) => setArchdeaconry(e.target.value)}
                name="archdeaconry"
                label="Archdeaconry"
                basis
                options={archdeaconryOptions}
                denomination={denomination}
              />
              <Input
                // required
                error={error}
                // value={}
                removeError={removeError}
                onChange={setSelectedOption}
                name="parish"
                label="Parish"
                basis
                options={churchList}
                value={selectedOption}
                denomination={denomination}
              />
            </div>
            {/* Archdeaconry and Parish */}

            {/* Transaction/Payment ID: */}

            {/* Registration */}
            <div className="flex gap-3 text-center justify-center">
              <p className="text-faint-blue">
                By Registering, you are indicating that you have <br /> Read and
                agreed to the{" "}
                <a href="" className="text-red-500 underline">
                  Rules & Regulations
                </a>{" "}
                for the camp
              </p>
            </div>
            {/* Registration */}
          </div>

          <div className="mt-5 lg:flex gap-3 lg:space-y-0 space-y-3 relative">
            {disable === true ? (
              <button
                className={`w-full outline-none ring-[0.3px] ring-text-primary bg-gray-200 transition-all rounded-md p-3 text-primary-main text-[15px] cursor-not-allowed `}
                disabled
              >
                Register
              </button>
            ) : (
              <button
                type="submit"
                onClick={submitForm}
                className={`w-full outline-none ring-[0.3px] ring-text-primary bg-blue-900 hover:bg-reddish transition-all rounded-md p-3 text-white text-[15px] `}
              >
                {regsitrationTextStatus}
              </button>
            )}
            <a
              href="/"
              className="rounded-[5px] bg-reddish text-white lg:w-full w-full p-3 grid place-content-center hover:bg-blue-900 transition-all"
            >
              Back
            </a>
          </div>
        </form>
      </div>

      <div className="lg:flex fixed lg:right-0 w-[50%] h-full flex-col hidden  basis-[50%] space-y-2 justify-center items-center">
        <div className="flex items-center reg_image ">
          <img className="w-[full]" src={dlw} alt="" />
        </div>

        <div className="text-center p-3 space-y-3 basis-[20%]">
          <h1 className="font-medium tracking-wider uppercase text-red-700">
            Romans 16:26
          </h1>
          <p className="text-faint-blue font-normal">
            “ But now is made manifest, and by the scriptures of the <br />{" "}
            prophets, according to the commandment of the everlasting <br />
            God, made known to all nations for the obedience of faith: “
          </p>
        </div>
      </div>

      {/* Notification */}
      <>
        {/* Global notification live region, render this permanently at the end of the document */}
        {regsitrationStatus === false ? (
          <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 "
          >
            <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
              {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
              <Transition
                show={show}
                as={Fragment}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <FaExclamationCircle
                          className="h-6 w-6 text-reddish"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">
                          Error Occured While Registering!
                        </p>
                        <p className="mt-1 text-sm text-gray-500">Please Refresh This Page & Try Again.</p>
                      </div>
                      <div className="ml-4 flex flex-shrink-0">
                        <button
                          type="button"
                          className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => {
                            setShow(false);
                          }}
                        >
                          <span className="sr-only">Close</span>
                          <FaRegTimesCircle
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        ) : (
          <></>
        )}
      </>
      {/* Notification */}
    </div>
  );
}
