const Testimony = (e) => {
     return (
     <div className="flex flex-col basis-[100%] p-6 bg-[#e6e4fcc5] 2xl:h-[40vh] lg:h-[50vh]  space-y-6 justify-between">
          <p className="lg:text-[18px] text-[15px] font-grotesk font-normal ">
            {e.testimony}
          </p>
          <div className="flex items-center space-x-3 ">
              <img
                className=" rounded-full w-[80px] h-[80px] object-cover"
                src={e.image}
                alt=""
              />
              <div className="">
               <h2 className="text-[20px] font-grotesk text-primary-main font-bold">{e.name}</h2>
               <p className="text-reddish font-style font-bold text-[20px]">{e.title}</p>
              </div>
          </div>
        </div> 
     )
}

export default Testimony