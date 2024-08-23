import { useState } from "react";
import Logo from "../../assets/main_logo.svg";
import dlw from '../../assets/registrationpage/dlw.jpeg';
import axios from 'axios'
import { useNavigate } from "react-router-dom";



export default function Registration() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [gender, setGender] = useState('')
    const [archdeaconry, setArchdeaconry] = useState('')
    const [age, setAge] = useState('')
    const [parish, setParish] = useState('')
    const [transactionID, setTransactionID] = useState('')
    const [error, setError] = useState({})
    const navigate = useNavigate()

    const data = {
        fullName,   
        email,
        phoneNumber,
        age,
        gender,
        archdeaconry,
        parish,
        transactionID
    }

    console.log(data)
    const submitForm = async(e) =>{
        e.preventDefault()
       try{
        await axios.post('http://localhost:5000/api/registration', data)
        .then(() =>{
            navigate('/registration/success')
        })
        .catch(error =>{
            throw (error.response.data.errors)
        })
       }
       catch(err){
        setError(err)
    }
}
    console.log(error)

    const removeError = (e) =>{
        setError({...error, [e.target.name]: ''})
    }




    return (
        
        <div className="grid p-3  lg:grid-cols-2 lg:h-[100dvh] font-rubik">

                <div className="rounded-lg flex flex-col space-y-2  p-5 lg:basis-[50%] basis-full lg:justify-center relative">
                    <a href="/">
                    <img className="w-[250px] top-[10px]" src={Logo} alt="Logo" />
                    </a>
                    

                    <h1 className="lg:text-[25px] font-normal font-rubik-moonrock text-primary-main"> 2024 <span className="text-red-600">Camp</span> Registration </h1>
                    {/* {success ? (<div className="rounded-xl text-white bg-green-500 p-3">Registration Successful</div>) : (<></>)} */}
                    
                    <form method="post" className="space-y-5 " >
                        <div className="space-y-3">
                        <div className="text-[15px] space-y-1">
                            <label className="text-faint-blue fo
                            nt-normal tracking-[0.6px]">Full Name:</label>
                            <input type="text"
                            className={`w-full outline-none ring-[0.3px]  rounded-md p-3 text-text-primary placeholder:text-[#AAA] tracking-[0.8px] text-[14px] ${error['fullName'] ? 'ring-[1px] ring-[red]' : 'ring-text-primary'} `} name="fullName"
                            placeholder="Enter Your Name" required 
                            onInput={e=>setFullName((e.target.value))}
                            onChange={removeError}
                            /> 
                            {error['fullName'] ? (<p className="text-red-500 text-[14px]">{Object.values(error['fullName'])}</p>) : (<></>) }
                        </div>


                        <div className="flex lg:flex-row flex-col lg:space-x-2 text space-y-3 lg:space-y-0">

                            <div className="text-[15px] space-y-1 basis-[50%]">
                                <label className="text-faint-blue font-normal tracking-[0.6px]">Email:</label>
                                <input type="email"
                                className={`w-full outline-none ring-[0.3px] rounded-md p-3 text-text-primary placeholder:text-[#AAA] tracking-[0.8px] text-[14px] ${error['email'] ? 'ring-[1px] ring-[red]' : 'ring-text-primary'}`} name="email"
                                placeholder="Enter Your Email" required
                                onInput={e=>setEmail((e.target.value))}
                                onChange={removeError}
                                /> 
                                {error['email'] ? (<p className="text-red-500 text-[14px]">{Object.values(error['email'])}</p>) : (<></>) }
                            </div>

                            <div className="space-y-1 basis-[50%]">
                                <label className="text-faint-blue font-normal tracking-[0.6px]">Phone Number:</label>
                                <input type="number"
                                className={`w-full outline-none ring-[0.3px]  rounded-md p-3 text-text-primary placeholder:text-[#AAA] tracking-[0.8px] text-[14px] ${error['phoneNumber'] ? 'ring-[1px] ring-[red]' : 'ring-text-primary'}`} name="phoneNumber"
                                placeholder="Enter Phone Number" required
                                onInput={e=>setPhoneNumber((e.target.value))}
                                onChange={removeError}
                                /> 
                                {error['phoneNumber'] ? (<p className="text-red-500 text-[14px]">{Object.values(error['phoneNumber'])}</p>) : (<></>) }
                            </div>
                        </div>




                        <div className="flex lg:flex-row flex-col lg:space-x-2 text-[15px] space-y-3 lg:space-y-0">
                            
                            <div className="basis-[50%] space-y-1">
                                <label className="text-faint-blue font-normal tracking-[0.6px]">Age:</label>
                                {/* <input type="number"
                                className={`w-full outline-none ring-[0.3px]  rounded-md p-3 text-text-primary placeholder:text-[#AAA] tracking-[0.8px] text-[14px] ${error['age'] ? 'ring-[1px] ring-[red]' : 'ring-text-primary'}`} name="age"
                                placeholder="Enter Your Age" required
                                onInput={e=>setAge((e.target.value))}
                                onChange={removeError}
                                />  */}
                                <select className={`w-full outline-none ring-[0.3px] rounded-md p-3 text-[14px] tracking-[0.8px] text-text-primary bg-transparent ${error['age'] ? 'ring-[1px] ring-[red]' : 'ring-text-primary'}`}  name="age" onInput={e=>setAge((e.target.value))} onChange={removeError} required>
                                    <option value="">Select Age</option>
                                    <option value="15-20">15-20</option>
                                    <option value="21+">21+</option>
                                </select>
                                {error['age'] ? (<p className="text-red-500 text-[14px]">{Object.values(error['age'])}</p>) : (<></>) }
                            </div>

                            <div className=" basis-[50%] space-y-1">
                                <label className="text-faint-blue font-normal tracking-[0.6px]">Gender:</label>
                                <select className={`w-full outline-none ring-[0.3px] rounded-md p-3 text-[14px] tracking-[0.8px] text-text-primary bg-transparent ${error['gender'] ? 'ring-[1px] ring-[red]' : 'ring-text-primary'}`}  name="gender" id="gender" onInput={e=>setGender((e.target.value))} onChange={removeError} required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                {error['gender'] ? (<p className="text-red-500 text-[14px]">{Object.values(error['gender'])}</p>) : (<></>) }
                            </div>
                        </div>
                        

                        <div className="flex flex-col lg:flex-row lg:gap-2 text-[15px] space-y-3 lg:space-y-0">
                            <div className="basis-[50%] space-y-1">
                                <label className="text-faint-blue font-normal tracking-[0.6px]">Archdeaconry:</label>
                                <select className={`w-full outline-none ring-[0.3px] rounded-md p-3 tracking-[0.8px] text-[14px] text-text-primary bg-transparent ${error['archdeaconry'] ? 'ring-[1px] ring-[red]' : 'ring-text-primary'}`}  name="archdeaconry" id="archdeaconry" onInput={e=>setArchdeaconry((e.target.value))} 
                                onChange={removeError}required>
                                    <option value="">Select Your Archdeaconry</option>
                                    <option value="Abule Egba">Abule Egba</option>
                                    <option value="Agege">Agege</option>
                                    <option value="Amuwo Odofin">Amuwo Odofin</option>
                                    <option value="Bariga">Bariga</option>
                                    <option value="Cathedral">Cathedral</option>
                                    <option value="Festac">Festac</option>
                                    <option value="Gowon Estate">Gowon Estate</option>
                                    <option value="Iba">Iba</option>
                                    <option value="Idimu">Idimu</option>
                                    <option value="Ijede">Ijede</option>
                                    <option value="Iju-Ishaga">Iju-Ishaga</option>
                                    <option value="Ikeja">Ikeja</option>
                                    <option value="Ikorodu">Ikorodu</option>
                                    <option value="Ikorodu-North">Ikorodu-North</option>
                                    <option value="Ikosi-Ketu">Ikosi-Ketu</option>
                                    <option value="Imota">Imota</option>
                                    <option value="Ipaja">Ipaja</option>
                                    <option value="Isolo">Isolo</option>
                                    <option value="Ogudu">Ogudu</option>
                                    <option value="Ojo">Ojo</option>
                                    <option value="Ojo-Alaba">Ojo-Alaba</option>
                                    <option value="Ojodu">Ojodu</option>
                                    <option value="Opebi">Opebi</option>
                                    <option value="Oshodi">Oshodi</option>
                                    <option value="Oto-Awori'">Oto-Awori</option>
                                    <option value="Owutu">Owutu</option>
                                    <option value="Satallite">Satallite</option>
                                    <option value="Somolu">Somolu</option>
                                </select>
                                {error['archdeaconry'] ? (<p className="text-red-500 text-[14px]">{Object.values(error['archdeaconry'])}</p>) : (<></>) }
                            </div>

                            <div className="text-[15px] basis-[50%] space-y-1">
                                <label className="text-faint-blue font-normal tracking-[0.6px]">Parish:</label>
                                <input type="text"
                                className={`w-full outline-none ring-[0.3px]  rounded-md p-3 text-text-primary placeholder:text-[#AAA] tracking-[0.8px] text-[14px] ${error['parish'] ? 'ring-[1px] ring-[red]' : 'ring-text-primary'}`} name="parish"
                                placeholder="Enter Parish" onInput={e=>setParish((e.target.value))} 
                                onChange={removeError} required
                                /> 
                                {error['parish'] ? (<p className="text-red-500 text-[14px]">{Object.values(error['parish'])}</p>) : (<></>) }
                            </div>
                        </div>
                        </div>

                        <div className="text-[15px] space-y-1">
                            <label className="text-faint-blue fo
                            nt-normal tracking-[0.6px]">Transaction ID:</label>
                            <input type="text"
                            className={`w-full outline-none ring-[0.3px]  rounded-md p-3 text-text-primary placeholder:text-[#AAA] tracking-[0.8px] text-[14px] ${error['transactionID'] ? 'ring-[1px] ring-[red]' : 'ring-text-primary'} `} name="transactionID"
                            placeholder="Enter Your Transaction ID" required 
                            onInput={e=>setTransactionID((e.target.value))}
                            onChange={removeError}
                            /> 
                            {error['transactionID'] ? (<p className="text-red-500 text-[14px]">{Object.values(error['transactionID'])}</p>) : (<></>) }
                        </div>

                        <div className=" mt-5">
                        <button type="submit" onClick={submitForm} className="w-full outline-none ring-[0.3px] ring-text-primary bg-blue-900 hover:bg-reddish rounded-md p-3 text-white text-[15px]">
                            Register
                        </button>
                        </div>
                    </form>

                    
                </div>
                
           
           
           <div className="lg:flex flex-col hidden basis-[50%] space-y-2">
                    <div className="flex items-center reg_image ">
                        <img className="w-full" src={dlw} alt="" />
                    </div>

                    <div className="text-center p-3 space-y-3 basis-[20%]">
                        <h1 className="font-medium tracking-wider uppercase text-red-700">
                        Romans 16:26
                        </h1>
                        <p className="text-faint-blue font-normal">
                        “ But now is made manifest, and by the scriptures of the <br /> prophets, according to the commandment of the everlasting <br />God, made known to all nations for the obedience of faith: “
                        </p>                        
                </div>

           </div>
           
        </div>

        
    )
}