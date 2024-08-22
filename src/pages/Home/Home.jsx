import NavBar from "../../components/Nav_Bar/Nav_Bar";
import ChaplainBanner from "../../assets/homepage/ChaplainBanner.svg";
import Chaplain from "../../assets/homepage/chaplain.jpg";
import CountUp from "react-countup";
import EventCard from "../../components/Cards/Event"
import EventData from "../../data/Events"
import Footer from "../../components/Footer/Footer"


const HomePage = () => {
  return (
    <>
      <NavBar />

      {/* Banner */}
      <div className="lg:p-[50px] p-2 grid lg:grid-cols-2">
        <div className=" flex justify-center items-center lg:p-[30px]lg:h-full h-[90lvh]">
          <div className=" w-full text-left space-y-5 p-3">
            <h1 className="lg:text-[50px] text-[40px] text-primary-main font-rubik font-bold leading-[50px]">
              Welcome To DLWYC!
            </h1>
            <p className="font-grotesk text-text-paragraph leading-7 text-[15px] w-[95%]">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi
              dolores, facilis molestiae odio perferendis deleniti quas iste
              animi sunt. Tempora libero consequatur commodi fugiat dolorem,
              laboriosam accusantium nobis voluptate ipsam nesciunt deserunt!
              Porro minima cum hic tempore voluptates doloribus laudantium
              cumque autem! Quisquam sit architecto doloremque ipsa, sed
              inventore molestias?
            </p>

            <div className="flex">
              
              <a
                href="#chaplain"
                className="p-button rounded-md font-poppins font-bold text-[15px] bg-reddish text-white"
              >
                Explore
              </a>{" "}
            </div>
          </div>
        </div>

        <div className=" flex justify-center items-center p-[20px]">
          <div className="w-full lg:h-[75vh] h-[60lvh] flex  space-x-2 lg:mt-14">

            <div className="left flex flex-col lg:basis-[30%] basis-[50%] space-y-5">
              <div className="top_left  basis-[60%] rounded-l-3xl overflow-hidden"></div>
              <div className="bottom_left  basis-[40%] rounded-l-3xl grid"></div>
            </div>

            <div className="center lg:flex hidden basis-[40%]"></div>

            <div className="right flex flex-col lg:basis-[30%] basis-[50%] space-y-5">
              <div className="top_right  basis-[40%] rounded-r-3xl overflow-hidden"></div>
              <div className="bottom_right  basis-[60%] rounded-r-3xl grid"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Banner */}

      {/* Word From Chaplain */}
      <div
        className="bg-cover bg-no-repeat lg:flex lg:p-[40px] p-6 gap-5 relative lg:space-y-0 space-y-12"
        style={{ backgroundImage: `url(${ChaplainBanner})` }} id="chaplain"
      >
        <div className="basis-[50%] flex items-center justify-center lg:p-[30px] lg:m-0 mt-8">
          <div
            className="chaplain relative w-full lg:h-[75lvh] h-[50vh] bg-no-repeat bg-center bg-cover rounded-lg"
            style={{ backgroundImage: `url(${Chaplain})` }}
          ></div>
        </div>

        <div className="basis-[60%] flex items-center justify-center">
          <div className=" w-full flex flex-col justify-center text-left p-3 space-y-4 ">
            <h1 className="font-header text-white lg:text-[36px] text-[30px]">
              A Word From The Chaplain
            </h1>
            <p className="leading-7 text-[15px] text-white  lg:w-[80%] font-light font-grotesk">
             Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel eius optio asperiores molestiae, quia sed laboriosam totam aliquid, nesciunt quas saepe impedit in ab tenetur accusantium earum possimus aspernatur dolores, magni perspiciatis architecto sequi inventore quidem neque? Ex dolore a error quia necessitatibus omnis fugit, velit asperiores cupiditate saepe explicabo.
             <br />
             Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia accusantium amet harum perferendis error consequuntur, sapiente aut, illo enim reprehenderit blanditiis quo veritatis, repellendus dolor ipsa similique sequi placeat nisi vel officiis nihil! Vel, expedita voluptatibus consequuntur distinctio nesciunt voluptate.
            </p>

          <div className=" h-full">
               <h1 className="font-header text-yellow lg:text-[24px]">The Chaplain:</h1>
               <p className="uppercase font-rubik text-white lg:text-[24px] font-normal">
                    Ven. Ariire Ayo Kolawole
               </p>
          </div>
          </div>
        </div>
      </div>
      {/* Word From Chaplain */}



      {/* Theme */}
      <div className="bg-[#eae7fd94] lg:flex flex-col justify-center space-y-5 lg:p-[50px] p-[30px]">
          <div className="lg:p-[40px] lg:m-0 mt-7 text-center">
               <p className="font-style text-yellow lg:text-[45px] text-[29px] p-0">2024 Diocesan Theme</p>
               <h1 className="font-header lg:text-[40px] text-[30px] text-primary-main">Fight the good fight of faith</h1>
               <p className="font-san text-[18px] text-reddish font-medium">1 Timothy 6:12</p>

          </div>
               {/* Stats */}
               <div className="p-[20px] grid lg:grid-cols-3 lg:space-x-5 lg:space-y-0 space-y-4">
                    <div className="text-center">
                         <p className="font-san text-reddish font-medium text-[16px]">Archdeaconries</p>
                         <h1 className="text-[70px] font-bold font-dosis text-primary-main">30</h1>
                    </div>
                    <div className="text-center">
                         <p className="font-san text-reddish font-medium text-[16px]">Parishes</p>
                         <h1 className="text-[70px] font-bold font-dosis text-primary-main"> <CountUp end={300} scrollSpyDelay={200} duration={2} enableScrollSpy='True' scrollSpyOnce='True'/><span className="text-reddish">+</span> </h1>
                    </div>
                    <div className="text-center">
                         <p className="font-san text-reddish font-medium text-[16px]">Youths</p>
                         <h1 className="text-[70px] font-bold font-dosis text-primary-main"><CountUp end={50} scrollSpyDelay={200}  duration={2} enableScrollSpy='True' scrollSpyOnce='True'/>k<span className="text-reddish">+</span></h1>
                    </div>
               </div>
               {/* Stats */}
      </div>
      {/* Theme */}

      {/* Events */}
    <div className="grid bg-[#f6f6f634] p-3">
      <h1 className="font-header text-[34px] p-6 text-primary-main">Upcoming Events</h1>

      <div className="p-2 gap-5 grid lg:grid-cols-2 items-center">
      {EventData.map(event=>(
        <div key={event.id} className={`grid ${event.id === 1 ? 'row-span-2  justify-center items-center' : ''}`}>
          <EventCard title={event.title} date={event.date} description={event.description} image={event.image} link={'/registration'} id={event.id}  position={`${event.id === 1 ? 'grid lg:space-y-2' : 'lg:flex grid mt-0'}`} imagesize='True'/>
        </div>
      )).slice(0,3)}
    </div>
    
    <div className="p-5 grid place-content-center">
      <a href="/events" className="bg-reddish text-white font-rubik tracking-wide p-eventbutton rounded-full hover:bg-primary-main transition-all"> View All </a>
    </div>

    </div>
      {/* Events */}


    {/* Footer */}
      <Footer />
    {/* Footer */}

    </>
  );
};

export default HomePage;
