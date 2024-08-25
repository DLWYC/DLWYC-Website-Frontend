import NavBar from "../../components/Nav_Bar/Nav_Bar"
import topleft from '../../assets/aboutpage/top_left.jpg'
import bottomleft from '../../assets/aboutpage/bottom_left.jpg'
import topright from '../../assets/aboutpage/top_right.jpg'
import bottomright from '../../assets/aboutpage/bottom_right.jpg'
import vision from '../../assets/aboutpage/vision.jpg'
import mission from '../../assets/aboutpage/mission.jpg'
import group42 from '../../assets/aboutpage/Group 42.svg'
import group46 from '../../assets/aboutpage/Group 46.svg' 
import circleimg from '../../assets/aboutpage/782b413521d2af72148944b866c996f2.jpg'     
 
const About = () =>{
     return (
          <div className="">
               <NavBar />
               <div className="flex h-[100vh] p-[50px] items-center ">
                    <div className="flex h-[70vh] basis-[60%] space-x-4">
                         <div className=" space-y-5 flex flex-col basis-[50%]">
                             <div className="border rounded-[35px] basis-[40%] bg-no-repeat bg-center bg-cover " style={{backgroundImage: `url(${topleft})`}}> 
                              </div>
                              <div className="border rounded-[35px] basis-[60%] bg-no-repeat bg-center bg-cover " style={{backgroundImage: `url(${bottomleft})`}}> 
                              </div>  
                         </div>
                        <div className="flex flex-col basis-[35%] space-y-5 mt-10">
                              <div className="border rounded-[35px] basis-[60%] bg-no-repeat bg-center bg-cover " style={{backgroundImage: `url(${topright})`}}>

                              </div>
                              <div className="border rounded-[35px] basis-[40%] bg-no-repeat bg-center bg-cover " style={{backgroundImage: `url(${bottomright})`}}>

                              </div>
                        </div>

                    </div>
                    
                    <div className="basis-[50%]">
                         <h1 className="text-red-700 font-style font-semibold text-[30px]">About Us</h1>
                         <h2 className="font-bold text-[40px] font-header ">WELCOME! HERE IS WHAT <br /> WE ARE.</h2>
                         <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit, ipsum cumque iusto maxime dolore dignissimos sapiente quas debitis, quia nesciunt eius accusantium omnis nam! Accusamus ea accusantium iure at consectetur!
                         Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo, in vitae repellat eum exercitationem velit optio. Cupiditate quo error expedita omnis doloribus aperiam. Laudantium, quibusdam temporibus expedita tempora natus sequi!
                         Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia alias repudiandae sint, dolore quis culpa repellendus error qui eaque totam asperiores! Amet perferendis ut soluta voluptate qui, hic dolores rem.
                         Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia doloremque, ad tempore non accusamus facilis suscipit ab iusto tempora sit, temporibus possimus laudantium? Beatae voluptatibus dicta veritatis et velit minima?
                         Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, assumenda odio. Nobis sit neque tempora! Harum incidunt quis labore eveniet natus, excepturi magnam eligendi dolores. Porro amet omnis assumenda vero!
                         lore
                         </p>
                    </div>

                    
               </div>

               <div className="bg-blue-950 grid">
                    <div className="grid grid-cols-2">
                         <div className="">
                              <img src={vision} alt="" />
                         </div>
                         <div className="grid items-center justify-center">
                              <img src={group46} alt="" />

                              <p className="text-white font-poppins text-[20px]">To be the leading Diocese in the Church of Nigeria in <br /> preparing the Nation for the second coming of our Lord  <br />Jesus Christ.</p>
                              <div className="flex justify-between">
                                   <p className="text-white text-[50px] font-style">Our Vision  
                              
                                   </p>  
                                   <img src={group42} alt="" />
                              </div>
                              
                              
                         </div>
                    </div>
                    
                    <div className="grid grid-cols-2">
                         <div className="grid items-center justify-center">
                              <div className="flex justify-between">
                                   <img src={group42} alt="" />
                                   <h1 className="text-white text-[40px] font-style">Our Mission</h1>
                              </div>
                              
                              <p className="text-white font-poppins text-[15px]">
                                   <p className="mb-2">To ensure a sustained growth in the number of churches <br /> and worshippers within the Diocese <br /></p>
                                   
                                   <p className="mb-2">To continue to enhance the mode of worship, teach and preach the <br /> word of God in all our churches thereby creating worshippers fit for the kingdom of Heaven. <br /></p>

                                   <p className="mb-2">To continue to enhance the mode of worship, teach and preach the <br /> word of God in all our churches thereby creating worshippers fit for the kingdom of Heaven. <br /></p>
                                   
                                   <p className="mb-2">To assist every member in the understanding and practice of  <br />the 39 Articles of our faith. <br /></p>
                                   
                                   <p className="mb-2">To develop and inspire in every church the principles of self-sufficiency <br /> and Christian generosity, thereby ensuring a strong and viable Diocese <br /></p>
                                   
                                   <p>To continue to promote peaceful and cordial relationship with the <br /> other Dioceses, in order to ensure the success of our common <br /></p>
                                   <div className="flex justify-between">
                                        <p>commitment.</p>
                                        <img src={group46} alt="" />
                                   </div>
                                   
                              </p>
                              
                         </div>
                         <div className="">
                              
                              <img src={mission} alt="" />
                         </div>
                    </div>
               </div>
               <div className="text-center font-bold"> 
                    <h1 className="text-[45px] font-header mt-10 mb-5 ">TESTIMONIES FROM OUR YOUTH </h1>
               </div>
               <div className="flex items-center justify-center space-x-5 ">
                    <div className="flex basis-[50%] flex-col p-10 bg-slate-200 ">
                         <p className="text-[20px] font-Grotesk">I was lost and searching for purpose, but through this church, I found my way back to God and discovered a community that loves and supports me. The teachings and sermons at this church have transformed my life and helped me grow deeper in my faith.</p>
                         <div className="">
                              <div className="">
                                   <img className="border rounded-full w-[100px] h-[100px] object-cover" src={circleimg} alt="" />
                              </div>
                         </div>
                    </div>
                    <div className="flex basis-[50%]  bg-slate-200">
                         

                    </div>
               </div>
               
              
               
          </div>
     )
}

export default About