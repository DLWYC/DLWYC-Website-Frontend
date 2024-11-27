const Section = (e) =>{
     return (
         <div
        className={`bg-cover bg-no-repeat lg:flex lg:p-[40px] p-6 gap-5 relative  lg:space-y-0 space-y-12  ${e.bishop ? 'flex-row-reverse' : 'flex-row bg-[#fdfdfde7] '}`}
        style={{ backgroundImage: `url(${e.BannerImage})` }} id="chaplain"
      >
        <div className="basis-[50%] flex items-center justify-center lg:p-[30px] lg:m-0 mt-8">
          <div
            className="chaplain relative w-full lg:h-[80lvh] aspect-[1.3] bg-no-repeat bg-center bg-cover rounded-lg"
            style={{ backgroundImage: `url(${e.Image})` }}
          ></div>
        </div>

        <div className={`basis-[60%] flex items-center ${e.bishop ? 'text-white basis-[60%]' : 'text-primary-main'} justify-center`}>
          <div className={`w-full flex flex-col justify-center p-3 space-y-4 ${e.bishop ? 'text-left' : 'text-right'} `}>
            <h1 className="font-header  lg:text-[36px] text-[30px]">
              {e.headerText}
            </h1>
            <p className={`leading-7 text-[15px] ${e.bishop ? '' : ''} font-light font-grotesk`}>
            {e.text}
            </p>

          <div className=" h-full">
               <h1 className="font-header text-yellow lg:text-[24px]">{e.title}</h1>
               <p className="font-rubik lg:text-[24px] font-normal">
                    {e.name}
               </p>
          </div>
          </div>
        </div>
      </div>
     )
}

export default Section