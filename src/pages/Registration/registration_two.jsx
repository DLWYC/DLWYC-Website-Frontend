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
  denominationOptions
} from "../../data/Inputs";
import { useNavigate } from "react-router-dom";
import { PaystackButton }  from 'react-paystack'

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
  const [camperType, setCamperType] = useState('')
  const [denomination, setDenomination] = useState('')
  const [transactionID, setTransactionID] = useState("");
  const [totalNumberOfCamperWithTransactionID, setTotalNumberOfCamperWithTransactionID] = useState('')
  const [paymentMode, setPaymentMode] = useState('')
  const [churchList, setChurchList] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const data = {
    fullName,
    email,
    phoneNumber,
    age,
    gender,
    archdeaconry,
    parish,
    camperType,
    denomination,
    transactionID,
    totalNumberOfCamperWithTransactionID
  };
  console.log(data)

  //   ## Submit Form Data
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post("http://localhost:5000/api/registration", data)
        .then(() => {
          navigate("/registration/success");
        })
        .catch((error) => {
          throw error.response.data.errors;
        });
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    //   ## Filter Parishes by Archdeaconry

    if (archdeaconry) {
        const handleArchdeaconryFilter = Churches.filter(
          (item) => item.archdeaconry === archdeaconry
        );
        const churches = handleArchdeaconryFilter.flatMap((churches) =>
          churches.churches.map((church) => ({ value: church.name, label: church.name }))
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

  useEffect(()=>{
    if(denomination === 'Anglican' && selectedOption){
      setParish(selectedOption.value);
    }
    else if ( denomination === "Non-Anglican") {
      setParish(null)
      } 
      else {
        setParish(null);
      }
  }, [selectedOption])

  console.log(selectedOption, parish);

  const removeError = (e) =>{
    setError({...error, [e.target.name]: ''})
  }

  // console.log(s)
  // const config = {
  //   reference: (new Date()).getTime().toString(),
  //   email: 'timmyaof02@gmail.com',
  //   amount: 100 * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
  //   publicKey: 'pk_test_9abab449df3c60468f89cefc5f4ad8e92db8266f',
  //   callback_url: 'http://localhost:5173/registration/success'
  // };

  // const componentProps = {
  //   ...config,
  //   text: "Proceed To Payment",
  //   onSuccess: (response) => {console.log(response); navigate("/registration/success")},
  //   onClose: (d) => {console.log("U sure", d)},
  // }

  return (
    <div className="grid lg:p-3 p-0 relative  h-full lg:grid-cols-2 lg:place-content-center font-rubik  ">
      <div className="rounded-lg flex  h-full flex-col space-y-2 lg:p-5 p-2 lg:basis-[50%] basis-full lg:justify-center relative ">
        <div className="justify-between items-center lg:flex grid space-y-3">
          <img className="w-[250px] top-[10px]" src={Logo} alt="Logo" />
        </div>

        <h1 className="lg:text-[25px] font-normal font-rubik-moonrock text-primary-main">
          {" "}
          2024 <span className="text-red-600">Camp</span> Registration{" "}
        </h1>
        {/* {success ? (<div className="rounded-xl text-white bg-green-500 p-3">Registration Successful</div>) : (<></>)} */}

        <form method="post" className="space-y-5 font-rubik ">
          <div className="space-y-3 ">
            {/* FirstName */}
            <div className="text-[15px] space-y-1">
              <Input
                error={error}
                removeError = {removeError}
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
                error={error}
                removeError = {removeError}
                onInput={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter Email"
                name="email"
                label="Email"
                basis
              />
              <Input
                error={error}
                removeError = {removeError}
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
                error={error}
                removeError = {removeError}
                onInput={(e) => setAge(e.target.value)}
                name="age"
                label="Age"
                basis
                options={ageOptions}
              />
              <Input
                error={error}
                removeError = {removeError}
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
                error={error}
                removeError = {removeError}
                onInput={(e) => setCamperType(e.target.value)}
                name="camperType"
                label="Camper Type"
                basis
                options={camperTypeOptions} 
              />
              <Input
                error={error}
                removeError = {removeError}
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
                error={error}
                removeError = {removeError}
                onInput={(e) => setArchdeaconry(e.target.value)}
                name="archdeaconry"
                label="Archdeaconry"
                basis
                options={archdeaconryOptions}
                denomination = {denomination}
              />
              <Input
                error={error}
                removeError = {removeError}
                onChange={setSelectedOption}
                name="parish"
                label="Parish"
                basis
                options={churchList}
                value={selectedOption}
                denomination = {denomination}
              />
            </div>
            {/* Archdeaconry and Parish */}

            {/* Transaction/Payment ID: */}
            <div className="text-[15px] space-y-1">
              <Input
                error={error}
                removeError = {removeError}
                onInput={(e) => setTransactionID(e.target.value)}
                type="text"
                placeholder="Enter Transaction/Payment ID:"
                name="transactionID"
                label="Transaction/Payment ID"
              />
            </div>

            {/* Transaction/Payment ID: */}

            {/* Payment Mode */}
            <div className="text-[15px] space-x-3 space-y-3">
            <p>Mode Of Payment: </p>
            <div className="flex space-x-4">
              <label htmlFor="singleMode" className="flex items-center justify-center">Single <span className="text-gray-600 text-[14px]"> [Myself]</span>
              </label>
                <input type="radio" name="paymentMode" id="singleMode" value={'single'} className={'ml-3'} onClick={e => setPaymentMode(e.target.value)} />

              <label htmlFor="multipleMode" className="flex items-center justify-center">Multiple <span className="text-gray-600 lg:text-[14px] text-[10px]"> [Myself & Others]</span>
              </label>
                <input type="radio" name="paymentMode" id="multipleMode" value={'multiple'} onClick={e => setPaymentMode(e.target.value)} className="ml-3"/>
            </div>
            
            </div>

            {/* Payment Mode */}

            {/* Transaction/Payment ID: */}
            {paymentMode === "multiple" ? (
              <div className="text-[15px] space-y-1">
              <Input
                error={error}
                removeError = {removeError}
                onInput={(e) => setTotalNumberOfCamperWithTransactionID(e.target.value)}
                type="number"
                placeholder="Enter Value"
                name="totalNumberOfCamperWithTransactionID
"
                label="Number Of Campers With the same Transaction ID"
              />
            </div> 
            ) : (<></>)}

            {/* Transaction/Payment ID: */}


            {/* Registration */}
            <div className="flex gap-3 text-center justify-center">
            <p className="text-faint-blue">By Registering, you are indicating that you have <br /> Read and agreed to the <a href="" className="text-red-500 underline">Rules & Regulations</a> for the camp</p>
            </div>
            {/* Registration */}
          </div>

          <div className="mt-5 lg:flex gap-3 lg:space-y-0 space-y-3">
            <button
              type="submit"
              onClick={submitForm}
              className="w-full outline-none ring-[0.3px] ring-text-primary bg-blue-900 hover:bg-reddish transition-all rounded-md p-3 text-white text-[15px]"
            >
              Register
            </button>
            {/* <PaystackButton className="w-full outline-none ring-[0.3px] ring-text-primary bg-blue-900 hover:bg-reddish transition-all rounded-md p-3 text-white text-[15px]"  { ...componentProps }  /> */}
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
    </div>
  );
}
