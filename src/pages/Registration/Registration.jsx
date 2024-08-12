import Logo from "../../assets/main_logo.svg";
import dlw from '../../assets/registrationpage/dlw.jpeg';
// import NavBar from "../../components/Nav_Bar/Nav_Bar"



export default function Registration() {
    return (
        
        <div className="grid p-3 items-center justify-center lg:grid-cols-2 h-[100dvh]  font-rubik">
                    
                <div className="rounded-lg flex flex-col space-y-2 p-5 border basis-[50%]">
                    <img className="w-[250px] relative -left-2" src={Logo} alt="Logo" />
                    <h1 className="lg:text-[25px] font-normal font-rubik-moonrock text-primary-main"> 2024 <span className="text-red-600">Camp</span> Registration </h1>

                    <form action="" className="space-y-3">
                        <div className="text-[15px] space-y-1">
                            <label className="text-faint-blue font-normal tracking-[0.6px]">First Name</label>
                            <input type="text"
                            className="w-full outline-none ring-[0.3px] ring-text-primary rounded-md p-3 text-text-primary placeholder:text-[#AAA] tracking-[0.8px] text-[14px] "
                            placeholder="Enter Your Name" required
                            /> 
                        </div>

                        <div className="text-[15px] space-y-1">
                            <label className="text-faint-blue font-normal tracking-[0.6px]">Email</label>
                            <input type="email"
                            className="w-full outline-none ring-[0.3px] ring-text-primary rounded-md p-3 text-text-primary placeholder:text-[#AAA] tracking-[0.8px] text-[14px]"
                            placeholder="Enter Your Email" required
                            /> 
                        </div>

                        <div className="flex lg:flex-row flex-col lg:space-x-2 text-[15px]">
                            <div className="basis-[50%] space-y-1">
                                <label className="text-faint-blue font-normal tracking-[0.6px]">Phone Number</label>
                                <input type="number"
                                className="w-full outline-none ring-[0.3px] ring-text-primary rounded-md p-3 text-text-primary placeholder:text-[#AAA] tracking-[0.8px] text-[14px]"
                                placeholder="Enter Phone Number" required
                                /> 
                            </div>

                            <div className=" basis-[50%] space-y-1">
                                <label className="text-faint-blue font-normal tracking-[0.6px]">Gender</label>
                                <select className="w-full outline-none ring-[0.3px] ring-text-primary rounded-md p-3 text-[14px] tracking-[0.8px] text-text-primary bg-transparent"  
                                    name="gender" id="gender" required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                        

                        <div className="flex flex-col lg:flex-row lg:gap-2 text-[15px]">
                            <div className="basis-[50%] space-y-1">
                                <label className="text-faint-blue font-normal tracking-[0.6px]">Archdeaconry</label>
                                <select className="w-full outline-none ring-[0.3px] ring-text-primary rounded-md p-3 tracking-[0.8px] text-[14px] text-text-primary bg-transparent"
                                    name="Archdeaconry" id="Archdeaconry" required>
                                    <option value="">Select Your Archdeaconry</option>
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

                            <div className="text-[15px] basis-[50%] space-y-1">
                                <label className="text-faint-blue font-normal tracking-[0.6px]">Parish</label>
                                <input type="text"
                                className="w-full outline-none ring-[0.3px] ring-text-primary rounded-md p-3 text-text-primary placeholder:text-[#AAA] tracking-[0.8px] text-[14px]"
                                placeholder="Enter Parish" required
                                /> 
                            </div>
                        </div>

                        <div className="text-[15px] space-y-1">
                            <label className="text-faint-blue font-normal tracking-[0.6px]">Price </label>
                            <input type="text" 
                            className="w-full outline-none ring-[0.3px] ring-text-primary rounded-md p-3 text-text-primary placeholder:text-[#AAA] tracking-[0.8px] text-[14px]"
                            value="# 2500" readOnly
                            /> 
                        </div>

                        <button type="submit" className="w-full outline-none ring-[0.3px] ring-text-primary bg-blue-900 rounded-md p-3 text-white text-[15px]">
                            Register
                        </button>
                    </form>

                    
                </div>
                
           
           
           <div className="lg:flex flex-col hidden justify-between basis-[50%] space-y-3">
                    <div className="flex items-center justify-center basis-[80%] reg_image ">
                        <img className="h-full w-full" src={dlw} alt="" />
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