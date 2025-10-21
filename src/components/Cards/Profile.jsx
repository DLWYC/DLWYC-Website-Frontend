function Cards(e) {
     return (
       <div className="relative flex flex-col">
         <div className="relative bg-[#0e0d2054]">
           <img
             className="h-full w-full aspect-square object-cover "
             src={e.image}
             alt="User"
           />
         </div>
           <div className={`bg-primary-main basis-[15%] text-white flex justify-center flex-col p-3`} >
             <h3 className="text-lg leading-8 tracking-normal  mt-2 font-medium font-header text-[25px]">
               {e.name}
             </h3>
             <p className="leading-6 font-grotesk text-[17px] text-yellow">{e.job}</p>
   
               
           </div>
       </div>
     );
   }
   
   export default Cards;
   