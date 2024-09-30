import { FaCheckCircle } from "react-icons/fa";
import {PaystackButton} from "react-paystack"
import { useNavigate } from "react-router-dom";
  // const navigate = useNavigate();


const email = window.localStorage.getItem('camperEmail')

const handleSuccess = (reference) => {
    // Handle the success response here
    console.log('Payment successful!', reference);

    // Redirect to another page after successful payment
    // navigate('/payment-success'); // Replace with the desired page route
  };

  const handleClose = () => {
    console.log('Payment closed');
  };

  const componentProps = {
    email,
    amount: 5000 * 100,
    publicKey :'pk_test_9abab449df3c60468f89cefc5f4ad8e92db8266f',
    text: 'Click Here To Make Payment',
    onSuccess: handleSuccess,
    onClose: handleClose,
  };


const Success = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-[#8080801f]">
      <div className="lg:basis-[40%] basis-[80%] rounded-lg p-[40px] bg-white flex flex-col items-center text-center space-y-3">
        <FaCheckCircle className="text-[#44d390e8] text-[120px]" />
        <p className="font-rubik tracking-wide text-[20px]">
          You are one step closer to completing your registration
        </p>
        <div className="grid place-content-center">
          {/* <a
            href="/"
            className="bg-[#393f8ba1] text-white font-rubik tracking-wide p-eventbutton rounded-full hover:bg-[#44d390e8] transition-all"
          >
           Go Back
          </a> */}
          <PaystackButton className="bg-[#393f8ba1] text-white font-rubik tracking-wide p-eventbutton rounded-full hover:bg-[#44d390e8] transition-all" {...componentProps} />

        </div>
      </div>
    </div>
  );
};

export default Success;
