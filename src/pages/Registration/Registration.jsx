import Logo from "../../assets/main_logo.svg";
import dlw from '../../assets/registrationpage/dlw.jpeg';
// import NavBar from "../../components/Nav_Bar/Nav_Bar"



export default function Registration() {
    return (
        
        <div className="flex flex-col lg:p-10 p-5 items-center justify-center gap-20 lg:flex-row  text-blue-900 lg:h-screen bg-[#F5F5F5]">
                    
                <div className="bg-[#fff] rounded-lg flex flex-col gap-2 px-9 py-4'">
                    <img className="w-[300px] mb-1" src={Logo} alt="Logo" />
                    <h1 className="text-4xl font-bold mb-1">
                    2024 <span className="text-red-600">Camp</span> Registration
                    </h1>
                    <div className="text-[15px]">
                       <label>First Name</label>
                        <input 
                        className="w-full border border-blue-900 rounded-md p-2 mt-1 "
                        placeholder="Enter Your Name" required
                        /> 
                    </div>

                    <div className="text-[15px]">
                       <label className="text-blue-900">Email</label>
                        <input 
                        className="w-full border border-blue-900 rounded-md p-2 mt-1"
                        placeholder="Enter Your Email" required
                        /> 
                    </div>

                    <div className="flex flex-col  lg:gap-2 text-[15px]">
                        <div>
                            <label>Phone Number</label>
                            <input 
                            className="w-full border border-blue-900 rounded-md p-2 mt-1"
                            placeholder="Enter Phone Number" required
                            /> 
                        </div>

                        <div>
                            <label>Gender</label>
                            <select className="w-full border border-blue-900 rounded-md p-2 mt-1"  
                                name="gender" id="gender" required>
                                <option value="">-Select Gender-</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                    

                    <div className="flex flex-col lg:flex-row lg:gap-2 text-[15px]">
                        <div>
                            <label>Archdeaconry</label>
                            <select className="w-full border border-blue-900 rounded-md p-2 mt-1"
                                name="Archdeaconry" id="Archdeaconry" required>
                                <option value="">-Select Your Archdeaconry-</option>
                                <option value="Abule Egba">Abule Egba</option>
                                <option value="Agege">Agege</option>
                                <option value="Amuwo Odofin">Amuwo Odofin</option>
                                <option value="Festac">Festac</option>
                                <option value="Gowon Estate">Gowon Estate</option>
                                <option value="Iba">Iba</option>
                                <option value="Idimu">Idimu</option>
                                <option value="Ijede">Ijede</option>
                                <option value="Ikeja">Ikeja</option>
                                <option value="Ikorodu-North">Ikorodu-North</option>
                                <option value="Ikosi-Ketu">Ikosi-Ketu</option>
                                <option value="Imota">Imota</option>
                                <option value="Ipaja">Ipaja</option>
                                <option value="Isolo">Isolo</option>
                                <option value="Ogudu">Ogudu</option>
                                <option value="Ojo">Ojo</option>
                                <option value="Ojo-Alaba">Ojo-Alaba</option>
                                <option value="Ojo-Alaba">Ojo-Alaba</option>
                                <option value="Opebi">Opebi</option>
                                <option value="Opebi">Opebi</option>
                                <option value="Oto-Awori'">Oto-Awori</option>
                                <option value="Owutu">Owutu</option>
                                <option value="Satallite">Satallite</option>
                                <option value="Somolu">Somolu</option>
                                <option value="Ikorodu">Ikorodu</option>
                            </select>
                        </div>

                        <div className="text-[15px]">
                            <label>Parish</label>
                            <input 
                            className="w-full border border-blue-900 rounded-md p-2 mt-1"
                            placeholder="Enter Parish" required
                            /> 
                        </div>
                    </div>
                    <div className="text-[15px]">
                        <label>Price </label>
                        <input 
                        className="w-full border border-blue-900 rounded-md p-2 mt-1"
                        placeholder="#2500" required
                        /> 
                    </div>

                    <button className="w-full border bg-blue-900 rounded-md p-2 mt-9 text-white text-[15px]">
                        Register
                    </button>

                    
                </div>
                
           
           
           <div className="lg:flex flex-col hidden items-center justify-center ">
                <div className="lg:flex-col items-center justify-center">
                    <img className="w-[600px] border " src={dlw} alt="" />

                    <div className="text-center mt-1 mb-1">
                        <h1 className="mb-4 font-bold text-red-700">
                        Romans 16:26
                        </h1>
                        <p className="text-blue-900 font-semibold ">
                        “ But now is made manifest, and by the scriptures of the <br /> prophets, according to the commandment of the everlasting <br />God, made known to all nations for the obedience of faith: “
                        </p>
                        
                    </div>
                </div>
           </div>
           
        </div>

        
    )
}