function Cards(e) {
     return (
       <div className="relative flex flex-col">
         <div className="relative border bg-[#0e0d2054]">
           <img
             className="h-full w-full aspect-[14/16] object-cover "
             src={e.image}
             alt="User"
           />
         </div>
           <div className={`bg-primary-main basis-[15%] text-white flex justify-center flex-col p-3`} >
             <h3 className="text-lg leading-8 tracking-normal  mt-2 font-medium font-header text-[25px]">
               {e.name}
             </h3>
             <p className="leading-7 font-style text-[22px] text-yellow">{e.job}</p>
   
               
           </div>
       </div>
     );
   }
   
   export default Cards;
   