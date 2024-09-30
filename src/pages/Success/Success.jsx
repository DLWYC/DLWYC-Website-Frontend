import { useEffect, useState, Fragment } from "react";

import { FaCheckCircle, FaExclamationCircle, FaRegTimesCircle} from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";




  const Success = () => {
  const [reference, setReference] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [regsitrationStatus, setRegsitrationStatus] = useState(true);
  const [show, setShow] = useState(true);
  const email = window.localStorage.getItem('email')
  console.log(email, regsitrationStatus)
  const navigate = useNavigate();


  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, [show]);

  useEffect(()=>{
    if( !email || email === ""){
      navigate('/registration')
    }
  }, [email])

  // const removeEmail = () => {
  //   window.localStorage.setItem('email', '')
  // }

  const submitForm = async (e) => {
    e.preventDefault()
    const paymentResponse = await axios.post("http://localhost:5000/api/payment", {email: email})
    console.log(`This is the response ${paymentResponse}`)
    
    if (paymentResponse.data.message){
      console.log(reference, paymentResponse.data.data.reference)
      setReference(paymentResponse.data.data.reference)
      setAccessCode(paymentResponse.data.data.access_code)
      console.log(accessCode, paymentResponse.data.data.access_code)
      window.localStorage.setItem('random', JSON.stringify(accessCode))
      window.location.href = paymentResponse.data.data.authorization_url
    }
    else if (paymentResponse.data.error === "Payed Already"){
      setRegsitrationStatus(false)
    }
      // navigate("/");
  };



  return (
    <div className="flex items-center justify-center h-screen bg-[rgba(233,233,233,0.75)]">
    {/* Notification */}
    <>
        {/* Global notification live region, render this permanently at the end of the document */}
        {regsitrationStatus === false ? (
          <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
          >
            <div className="flex w-full flex-col items-end space-y-4 sm:items-end absolute top-0 right-0">
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
                          Error Occured While Making Payment!
                        </p>
                        <p className="mt-1 text-sm text-gray-500">Sorry You Have Payed Already, Please Proceed to the Home Page</p>
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


      <div className="lg:basis-[40%] basis-[95%] rounded-lg lg:p-[40px] p-[30px] bg-[#ffffffee] flex flex-col items-center text-center space-y-3 border">
      <>
        <FaCheckCircle className="text-[#44d390e8] text-[120px]" />
        <p className="font-grotesk tracking-normal lg:text-[30px]">
          Registration Successful
        </p>
        <div className="grid lg:grid-cols-2 gap-4 place-content-center">
          <Link to={'/'}
            // onClick={removeEmail}
            className="bg-[#ce1e24f0] text-white font-rubik tracking-wide lg:px-5 lg:py-4 p-eventbutton rounded-lg hover:bg-[#44d390e8] transition-all"
          >
           Return Home
          </Link>
          {regsitrationStatus === false ?
            
          <button
            disabled
            className=" outline-none ring-[0.3px] ring-text-primary bg-gray-200 transition-all rounded-md p-3 text-primary-main text-[15px] cursor-not-allowed "
          >
           Proceed To Payment
          </button>
           :
          <button
            onClick={submitForm}
            className="bg-primary-main text-white font-rubik tracking-wide lg:px-5 lg:py-4 p-eventbutton rounded-lg hover:bg-yellow transition-all"
          >
           Proceed To Payment
          </button>
           
           }
        </div>
      </>

        
      
    
    </div>

    </div>
  );
};

export default Success;
