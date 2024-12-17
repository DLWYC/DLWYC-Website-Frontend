import { useState, useEffect } from "react";
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
import Alert from "../../components/Alert/Alert";

// Default values shown

export default function Registration() {
  // ## Set Loading State
  const [loadingState, setLoadingState] = useState(false);

  // ## This it to get the values of the inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [archdeaconry, setArchdeaconry] = useState("");
  const [parish, setParish] = useState("");
  const [inputError, setInputError] = useState({});
  const [generalError, setGeneralError] = useState({});
  const navigate = useNavigate();
  const [camperType, setCamperType] = useState("");
  const [denomination, setDenomination] = useState(null);
  const [churchList, setChurchList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [disable, setDisable] = useState();
  const [registrationStatus, setRegistrationStatus] = useState(true);
  const [paymentOption, setPaymentOption] = useState("Single");
  // const [noOfUnpaidCampers, setNoOfUnpaidCampers] = useState([]);
  const [noOfUnpaidCampersOption, setNoOfUnpaidCampersOption] = useState([]);
  const [noOfCampersToPayFor, setNoOfCampersToPayFor] = useState("");
  const [alert, setAlert] = useState("");

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
    paymentOption,
    noOfUnpaidCampersOption,
    noOfCampersToPayFor,
  };

  // ## Handle Input Changes
  //   ## Submit Form Data

  setTimeout(() => {
    setAlert(false);
  }, 6000);

  window.localStorage.setItem("paymentOption", paymentOption);

  const submitForm = async (e) => {
    setLoadingState(true);
    e.preventDefault();
    window.localStorage.setItem("email", userInput.email);
    try {
      const { data } = await axios.post(
        "https://api.dlwyouth.org/api/registration",
        // "http://localhost:5000/api/registration",
        userInput
      );
      if (data.message === "Registration Successful") {
        // window.localStorage.setItem("paymentUrl", data.paymentUrl);
        // window.localStorage.setItem("ref", data.reference);
        navigate("/registration/verify");
      } else {
        setGeneralError({ message: 'Registration Failed' })
        setRegistrationStatus(false);
        console.log('first')
      }
    } catch (err) {
      setLoadingState(false);
      if (err.response && err.response.data.message === "Input Errors") {
        setInputError(err.response.data.errors);
        console.log(err.response.data.errors)
        console.log('second')
      } 
      else {
        setGeneralError({ message: "Network Error" });
        console.log('fourth')
        setAlert(true);
      }
      // console.log(err.response.data.errors);
      console.log('gend')
      // console.log(err.response.data.errors);
    }
  };

  // console.log(loadingState)

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

  // ## Handle ArchdeaconryType
  useEffect(() => {
    if (denomination === "Anglican" && selectedOption) {
      setParish(selectedOption.value);
    } else if (denomination === "Non-Anglican") {
      setParish(null);
    } else {
      setParish(null);
    }
  }, [selectedOption, denomination]);

  // ## Handle Error Removal
  const removeError = (e) => {
    setInputError({ ...inputError, [e.target.name]: "" });
  };

  // # Get the payment type status
  // const getPaymentModeValue = async (e) => {
  //   const paymentOptions = e.target.value;
  //   setPaymentOption(paymentOptions);
  //   if (paymentOptions === "Multiple") {
  //     const campers = await axios.get(
  //       `https://api.dlwyouth.org/api/unPaidCampers?parish=` + parish
  //       // `http://localhost:5000/api/unPaidCampers?parish=` + parish
  //     );
  //     const camperList = campers.data.map((camper) => ({
  //       label: camper.fullName,
  //       value: camper.uniqueID,
  //       email: camper.email
  //     }));
  //     setNoOfUnpaidCampers(camperList);
  //   } else {
  //     setNoOfUnpaidCampers([]);
  //     setNoOfUnpaidCampersOption("");
  //   }
  // };

  useEffect(() => {
    setNoOfCampersToPayFor(noOfUnpaidCampersOption.length);
  }, [noOfUnpaidCampersOption]);

  // ## Get the Number OF Unpaid Campers

  return (
    <div className="grid lg:p-3 p-0 relative h-full lg:grid-cols-2 lg:place-content-center font-rubik  ">
      <div className="rounded-lg flex  h-full flex-col space-y-2 lg:p-5 p-2 lg:basis-[50%] basis-full lg:justify-center relative  ">
        <div className="justify-between items-center lg:flex grid space-y-3">
        <a href={'/'}>
          <img className="w-[250px] top-[10px]" src={Logo} alt="Logo" />
        </a>
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

        <form method="post" className="space-y-5 font-rubik ">
          <div className="space-y-3 ">
            {/* FirstName */}
            <div className="text-[15px] space-y-1">
              <Input
                // required
                error={inputError}
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
                error={inputError}
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
                error={inputError}
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
                error={inputError}
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
                error={inputError}
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
                error={inputError}
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
                error={inputError}
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
            {denomination === null ||
            denomination === "" ||
            denomination === "Non-Anglican" ? (
              ""
            ) : (
              <div className="flex lg:flex-row flex-col lg:space-x-2 text space-y-3 lg:space-y-0">
                <Input
                  // required
                  error={inputError}
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
                  error={inputError}
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
            )}
            {/* Archdeaconry and Parish */}

            {/* Transaction/Payment ID: */}
            {/* {denomination === null ||
            denomination === "" ||
            denomination === "Non-Anglican" ? (
              ""
            ) : denomination === "Anglican" && parish == null ? (
              ""
            ) : (
              <div className="lg:flex grid items-center border">
                <label className="text-faint-blue font-normal tracking-[0.6px]">
                  Payment Mode<span className="text-[red]">*</span>
                </label>
                <div className="flex lg:flex-row flex-col lg:gap-10 gap-4 p-3">
                  <div className="flex items-center space-x-3">
                    <label htmlFor="single">Single:</label>
                    <input
                      type="radio"
                      name="paymentOptions"
                      value={"Single"}
                      id="single"
                      onClick={getPaymentModeValue}
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <label htmlFor="multiple">Multiple:</label>
                    <input
                      type="radio"
                      name="paymentOptions"
                      value={"Multiple"}
                      id="multiple"
                      readOnly
                      onClick={getPaymentModeValue}
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <label htmlFor="paidByChurch">Church Sponsored:</label>
                    <input
                      type="radio"
                      name="paymentOptions"
                      value={"Church Sponsored"}
                      id="paidByChurch"
                      onClick={getPaymentModeValue}
                    />
                  </div>
                </div>
              </div>
            )} */}
            {/* Transaction/Payment ID: */}

            {/* Number Of Campers to pay for &7 Choices */}

            {/* {parish === "" || parish === null ? (
              ""
            ) : (
              <>
                {paymentOption === "Multiple" ? (
                  <div className="flex lg:flex-row flex-col lg:space-x-2 text space-y-3 lg:space-y-0">
                    <Input
                      required
                      error={inputError}
                      value={noOfCampersToPayFor}
                      removeError={removeError}
                      name="noOfCampersToPayFor"
                      label="Number Of Campers To Pay For"
                      basis
                      type={"number"}
                      readOnly
                    />
                    <Input
                      error={inputError}
                      // value={}
                      removeError={removeError}
                      onChange={setNoOfUnpaidCampersOption}
                      name="noOfUnpaidCampers"
                      label="List Of Unpaid Campers"
                      basis
                      options={noOfUnpaidCampers}
                      value={noOfUnpaidCampersOption}
                      // denomination={denomination}
                    />
                  </div>
                ) : (
                  ""
                )}
              </>
            )} */}
            {/* Number Of Campers to pay for &7 Choices */}

            {/* Registration */}
            <div className="flex gap-3 text-center justify-center">
              <p className="text-faint-blue">
                By Registering, you are indicating that you have <br /> Read and
                agreed to the{" "}
                <a href="" className="text-red-500 underline">
                  Rules & Regulations
                </a>
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
                className={`w-full outline-none ring-[0.3px] ring-text-primary ${
                  loadingState ? "bg-[#85858580] cursor-not-allowed" : "bg-blue-900 hover:bg-reddish"
                } transition-all rounded-md p-3 text-white text-[15px] `}
              >
                {loadingState ? (
                  'Registering...'
                ) : (
                  " Register "
                )}
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
        {registrationStatus === false ? (
          <Alert
            status={alert}
            header={"Regitration Failed!"}
            text={"Please Try Registering Again."}
          />
        ) : (
          ""
        )}
        {generalError.message === "Registration Failed" ? (
          <Alert
            status={alert}
            header={"Registration Failed!"}
            text={
              "Error Trying to Register This User. Please Reach out to the Technical Unit"
            }
          />
        ) : (
          ""
        )}
        {generalError.message === "Network Error" ? (
          <Alert
            status={alert}
            header={"Error Occured!"}
            text={
              "Error Connecting with the server. Please Reach out to the Technical Unit"
            }
          />
        ) : (
          ""
        )}
      </>
      {/* Notification */}
    </div>
  );
}
