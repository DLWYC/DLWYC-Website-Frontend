import { useEffect, useState} from "react";
import { FaCheckCircle} from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert/Alert"



  const Success = () => {
  const [reference, setReference] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [regsitrationStatus, setRegsitrationStatus] = useState(false);
  const email = window.localStorage.getItem('email')
  const paymentUrl = window.localStorage.getItem('paymentUrl')
  console.log(email, regsitrationStatus)
  const navigate = useNavigate();

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
    const paymentResponse = await axios.post("http://localhost:5000/api/payment", {email: email, paymentUrl: paymentUrl})
    console.log(`This is the response ${paymentResponse.data.paymentUrl}`)
       
    if (paymentResponse.data.message === "Payment Initialized"){
      window.location.href = paymentResponse.data.paymentUrl
    }
    else if (paymentResponse.data.error === "Payed Already"){
      setRegsitrationStatus(true)
    }
  };



  return (
    <div className="flex items-center justify-center h-screen bg-[rgba(233,233,233,0.75)]">
    {/* Notification */}
    <>
        {/* Global notification live region, render this permanently at the end of the document */}
        {regsitrationStatus === true ? (
          <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
          >
            <div className="flex w-full flex-col items-end space-y-4 sm:items-end absolute top-0 right-0">
              {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
              <Alert header={"Error Occured While Making Payment"} text={"Sorry You Have Payed Before, Please Proceed to the Home Page"} status={regsitrationStatus} />
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
          {regsitrationStatus === true ?
            
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
