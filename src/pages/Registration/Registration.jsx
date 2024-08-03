import Logo from "../../assets/main_logo.svg";
import dlw from '../../assets/registrationpage/dlw.jpeg';



export default function Registration() {
    return (
        <div className="flex items-center justify-center gap-20  h-screen ">

                <div>
                    <img className="w-[300px] mb-1" src={Logo} alt="Logo" />
                    <h1 className="text-4xl font-bold mb-2">
                    2024 <span className="text-red-600">Camp</span> Registration
                </h1>
                    <div>
                       <label>First Name</label>
                        <input 
                        className="w-full border border-blue-900 rounded-md p-2 mt-1 mb-2"
                        placeholder="Enter Your Name" required
                        /> 
                    </div>

                    <div>
                       <label>Email</label>
                        <input 
                        className="w-full border border-blue-900 rounded-md p-2 mt-1 mb-2"
                        placeholder="Enter Your Email" required
                        /> 
                    </div>

                    <div className="flex gap-10">
                        <div>
                            <label>Phone Number</label>
                            <input 
                            className="w-full border border-blue-900 rounded-md p-2 mt-1 mb-2 "
                            placeholder="Enter Phone Number" required
                            /> 
                        </div>

                        <div>
                            <label>Gender</label>

                            <select className="w-full border border-blue-900 rounded-md p-2 mt-1 mb-2"  
                                name="gender" id="gender" required>
                                <option value="">-Select Gender-</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option> 
                            </select>
                        </div>
                    </div>
                    <div>
                        <label>Upload Profile Image</label>
                        <input 
                        className="w-full border border-blue-900 rounded-md p-2 mt-1 mb-2"
                        placeholder="Select File To Be Uploaded" required
                        /> 
                    </div>

                    <div className="flex gap-2">
                        <div>
                            <label>Archdeaconry</label>
                            <select className="w-full border border-blue-900 rounded-md p-2 mt-1 mb-2"
                                name="Archdeaconry" id="Archdeaconry" required>
                                <option value="">-Select Your Archdeaconry-</option>
                                <option value="Lagos">Lagos</option>
                                <option value="Lagos">Lagos</option>
                                <option value="Lagos">Other</option>
                            </select>
                        </div>

                        <div>
                            <label>Parish</label>

                            <select className="w-full border border-blue-900 rounded-md p-2 mt-1 mb-2"
                                name="gender" id="gender" required>
                                <option value="">-Select Your Parish-</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label>Price </label>
                        <input 
                        className="w-full border border-blue-900 rounded-md p-2 mt-1"
                        placeholder="#2500" required
                        /> 
                    </div>

                    <button className="w-full border bg-blue-900 rounded-md p-2 mt-9 text-white">
                        Register
                    </button>

                    
                </div>
                
           
           
           <div className="hiddden lg:flex h-full items-center justify-center ">
                <div className="gap-4">
                    <img className="w-[600px] border rounded-md" src={dlw} alt="" />

                    <div className="text-center mt-3 mb-6">
                        <h1 className="mb-6 font-bold text-red-700">
                        Romans 16:26
                        </h1>
                        <p className="text-blue-900 font-semibold">
                        “ But now is made manifest, and by the scriptures of the <br /> prophets, according to the commandment of the everlasting <br />God, made known to all nations for the obedience of faith: “
                        </p>
                     </div>
                </div>
                
           </div>
           
        </div>

        
    )
}