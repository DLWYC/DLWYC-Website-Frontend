import { useState } from "react";
import Logo from "../../assets/main_logo.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert/Alert";
import Input from "../../components/Inputs/Inputs";



// Default values shown

export default function Login() {
  // ## Set Loading State
  const [loadingState, setLoadingState] = useState(false);
  // ## This it to get the values of the inputs
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [inputError, setInputError] = useState({});
  const [generalError, setGeneralError] = useState({});
  const navigate = useNavigate();
  const [registrationStatus, setRegistrationStatus] = useState(true);
  const [alert, setAlert] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

//   const handleTogglePassword = () => {
//     setShowPassword(!showPassword); 
//   };

  setTimeout(() => {
     setAlert(false);
   }, 6000);

  const userInput = {
    email,
    password,
  };

  // ## Handle Input Changes
  //   ## Submit Form Data

//   setTimeout(() => {
//     setAlert(false);
//   }, 6000);

const submitForm = async (e) => {
     setLoadingState(true);
     e.preventDefault();
     try {
       const { data } = await axios.post(
         "https://api.dlwyouth.org/api/dashboard/login",
        //  "http://localhost:5000/api/dashboard/login",
         userInput
       );
       if (data.message === "Login Successful") {
          window.localStorage.setItem('token', data.token);
         navigate("/dashboard");
       } else {
         setRegistrationStatus(false);
       }
     } catch (err) {
       setLoadingState(false);
       if (err.response && err.response.data.errors) {
          if(err.response.data.errors.error){
               console.log("sdfsdfsdf")
               setGeneralError({ message: err.response.data.errors.error });
          }
          else{
               setInputError(err.response.data.errors);
          }
       } else{
          setGeneralError({ message: "Network Error" });
          setAlert(true);
       }
     }
   };

   const removeError = (e) => {
     setInputError({ ...inputError, [e.target.name]: "" });
   };
  

  // ## Get the Number OF Unpaid Campers

  return (
    <div className="flex lg:p-3 p-0 absolute w-full h-full items-center justify-center font-rubik ">

      <div className="rounded-lg grid lg:w-[40%] w-[80%] space-y-2 lg:p-5 p-2 relative border border-[#5e5e5e3a] bg-[#bebebe6b]">
        <div className="justify-between items-center lg:flex grid space-y-3">
          <a href={"/"}>
            <img className="w-[250px] top-[10px]" src={Logo} alt="Logo" />
          </a>
        </div>

        <div className="lg:text-[17px] font-normal font-rubik-moonrock text-primary-main flex justify-between">
          <h1>
            <span className="text-red-600">Login - </span> Registration Unit{" "}
          </h1>
        </div>

        <form method="post" className="space-y-5 font-rubik pt-7 relative ">
        {generalError.message == 'Wrong Username or Password' ? 
         <p className="text-reddish flex items-center border w-full">{generalError.message}</p>
         :
         ''
        }
          <div className="space-y-3 ">
            {/* Email */}
            <div className="flex lg:flex-row flex-col lg:space-x-2 text space-y-3 lg:space-y-0">
              <Input
               //  required
                error={inputError}
                // value={''}
                removeError={removeError}
                onInput={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter Email"
                name="email"
                label="Email"
                
              />
            </div>
            {/* Email */}

            {/* FirstName */}
            <div className="text-[15px] space-y-1 relative flex items-end">
              <Input
               //  required
                error={inputError}
               //  value={}
                removeError={removeError}
                onInput={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                name="password"
                label="Password"
              />
              
            </div>
            {/* FirstName */}
            </div>
          <div className="mt-5 lg:flex gap-3 lg:space-y-0 space-y-3 relative">
          <button
                type="submit"
                onClick={submitForm}
                className={`w-full outline-none ring-[0.3px] ring-text-primary ${
                  loadingState ? "bg-[#85858580] cursor-not-allowed" : "bg-blue-900 hover:bg-reddish"
                } transition-all rounded-md p-3 text-white text-[15px] `}
              >
                {loadingState ? (
                  'Please Wait ...'
                ) : (
                  " Login "
                )}
              </button>
          </div>
        </form>
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
