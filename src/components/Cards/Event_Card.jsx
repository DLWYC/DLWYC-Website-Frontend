import { Link } from "react-router-dom"

const EventCard = (e) =>{
     return(
     <div className={`border border-[#b1b1b131] bg-white basis-[50%] p-3 rounded-lg lg:space-x-3 ${e.position}`}>
          <div className={`basis-[40%] rounded-xl bg-no-repeat bg-cover bg-center overflow-hidden `} >
          {/* <div className={`basis-[40%] rounded-xl bg-no-repeat bg-cover bg-center border border-red-500 h-[30lvh] ${e.imagesize === "True" & e.id === 1 ? 'lg:h-[80lvh]' : 'lg:h-full'}`} style={{backgroundImage: `url(${e.image})`}} >
          </div> */}
               {/* <Link to={e.link} className="border border-orange-400 w-full h-full"> */}
                    <img src={e.image} alt="" className={`w-full border-none outline-none object-cover object-top ${e.imagesize === "True" & e.id === 1 ? 'lg:h-[80lvh]' : 'lg:h-full'} `} />
               {/* </Link> */}
          </div>
          <div className="basis-[60%] p-2 flex flex-col space-y-5 justify-center">
               <div className="space-y-2">
                    <p className="text-reddish font-san">{e.date}</p>
                    <h1 className="font-poppins font-semibold text-[25px] text-text-primary leading-[35px]">{e.title}</h1>
                    <p className="font-grotesk text-[14px] font-light text-[#9e9d9de8] leading-[25px]">{e.description.substring(0, 250) + "..."} </p>
               </div>
               <div className="">
                    <Link to={e.link} className="font-grotesk text-primary-main">Read More...</Link>
               </div>
          </div>
     </div>

)}
          


export default EventCard