const Header = (e) => (
     <div className="banner lg:h-[25vh] h-[17vh] bg-[#091e5465] flex">
          <div className="h-[17vh] bg-[#00000005] flex items-end p-5 w-full">
                <h1 className="font-header text-white text-[25px] lg:text-[35px]">{e.text}</h1>
          </div>
     </div>
)

export default Header