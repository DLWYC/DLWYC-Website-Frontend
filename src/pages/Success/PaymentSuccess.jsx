import { useEffect, useState } from "react";

import { FaCheckCircle} from "react-icons/fa";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";


  const PaymentSuccess = () => {
  const [response, setResponse] = useState('')
  const [searchParam] = useSearchParams()
  const paymentOption = localStorage.getItem('paymentOption')
  

  const reference = searchParam.get('reference')
  console.log(reference)

  useEffect(()=>{
    axios.get(`https://api.dlwyouth.org/api/payment/${reference}/${paymentOption}`)
    // axios.get(`http://localhost:5000/api/payment/${reference}/${paymentOption}`)
    .then(res =>{
      console.log(res.data.data.customer.email)
      setResponse(res.data.data.status)
    })
    .catch(error=>{
      console.log(error)
     })
}, [reference, paymentOption])

     console.log(response)






  return (
    <div className="flex items-center justify-center h-screen bg-[rgba(233,233,233,0.75)]">
      <div className="lg:basis-[40%] basis-[95%] rounded-lg lg:p-[40px] p-[30px] bg-[#ffffffee] flex flex-col items-center text-center space-y-3 border">
      <>
        <FaCheckCircle className="text-[#44d390e8] text-[120px]" />
        <p className="font-grotesk tracking-normal lg:text-[30px]">
          Payment Successful 
        </p>
        <div className="grid w-full">
          <Link to={'/'}
            // onClick={submitForm}
            className="bg-[#11174df0] w-full text-white font-rubik tracking-wide lg:px-5 lg:py-4 p-eventbutton rounded-lg hover:bg-[#44d390e8] transition-all"
          >
           Return Home
          </Link>

        </div>
      </>

        
      
    </div>
    </div>
  );
};

export default PaymentSuccess;
