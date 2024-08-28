
const EventCard = (e) =>{
     return(
     <div className={`border border-[#b1b1b131]  shadow-red-900 basis-[50%] p-3 rounded-lg lg:space-x-3 flex lg:flex-row flex-col`}>
          <div className={`lg:basis-[50%] rounded-xl bg-no-repeat bg-cover bg-center overflow-hidden border lg:h-[40vh] h-[60vh]  `} style={{backgroundImage: `url(${e.image})`}} >
             </div>
          <div className="basis-[60%] p-2 flex flex-col space-y-5 justify-center">
               <div className="space-y-2">
                    <p className="text-reddish font-san">{e.date}</p>
                    <h1 className="font-poppins font-semibold text-[25px] text-text-primary leading-[35px]">{e.title}</h1>
                    <p className="font-grotesk text-[14px] font-light text-[#9e9d9de8] leading-[25px]">{e.description.substring(0, 250) + "..."} </p>
               </div>
               {/* <div className="">
                    <Link to={e.link} className="font-grotesk text-primary-main">Read More...</Link>
               </div> */}
          </div>
     </div>

)}
          


export default EventCard