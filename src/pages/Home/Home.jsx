import NavBar from "../../components/Nav_Bar/Nav_Bar";
import BannerImage from "../../assets/homepage/ChaplainBanner.svg";
import Bishop from "../../assets/bishop.jpg";
import Chaplain from "../../assets/homepage/chaplain.jpg";
import CountUp from "react-countup";
import EventCard from "../../components/Cards/Event";
import EventData from "../../data/Events";
import Footer from "../../components/Footer/Footer";
import Section from "../../components/Section/section";

const HomePage = () => {
  return (
    <>
      <NavBar />

      {/* Banner */}
      <div className="lg:p-[40px] p-2 flex lg:flex-row flex-col justify-center items-center">
        <div className=" flex 2xl:basis-[45%] lg:basis-[60%] justify-center items-end lg:items-center lg:p-[10px] lg:h-full h-fit lg:mt-0 mt-[70px] ">
          <div className=" text-left grid 2xl:space-y-2 space-y-5 p-3 mt-10 ">
            <h1 className="lg:text-[50px] text-[40px] text-primary-main font-rubik-moonrock font-normal leading-[50px]">
              Welcome To <span className="text-yellow">DLWYC !</span>
            </h1>
            <p className="font-grotesk text-text-paragraph leading-7 text-[15px] lg:w-[100%] ">
              Welcome to our home online! We are thrilled to have you here as
              part of the vibrant and dynamic youth chaplaincy of the Diocese of
              Lagos West. This space has been specially created with you in
              mind—a place where you can grow spiritually, connect with fellow
              believers, and find the encouragement you need as you journey in
              faith.
              {/* <br /> */}
              <br />
              <br />
              {/* <br /> */}
               Here, you’ll find everything
              from engaging contents and inspiring testimonies to event updates
              and service opportunities. Whether you’re seeking spiritual
              guidance, fellowship, or a place to get involved, this is where
              you can take your next steps in faith. Join us on this exciting
              journey as we grow together in Christ, strengthen our chaplaincy,
              and boldly live out our purpose. We’re glad you’re here. Let’s
              walk this journey of faith, service, and transformation together!
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

        <div className="2xl:basis-[40%] basis-[50%] w-full  flex justify-center  items-center p-[20px]">
          <div className="w-full 2xl:h-[60vh] lg:h-[75vh] h-[70lvh] flex  space-x-2 mt-2 lg:mt-3">
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

      {/* Word From Bishop */}
      <Section
        BannerImage={BannerImage}
        bishop
        headerText={"From The Diocesan"}
        Image={Bishop}
        name={"Rt Revd Dr. James Olusola Odedeji"}
        title={"The Diocesan:"}
        text={`It is with great joy and anticipation that I welcome you to this special space created just for you. As the next generation of leaders, dreamers, and changemakers, you are a vital part of our community, and your presence here is deeply valued.

In a world filled with both challenges and opportunities, I want you to know that your journey—both spiritual and personal—is important. You are not walking this path alone. This platform has been created to support you, inspire you, and give you a sense of belonging as you navigate life’s many stages.

      
This is Your Space for Growth and Connection

As young people, you face unique pressures and expectations, but within these challenges lies incredible potential. My prayer for each of you is that you will find strength, direction, and purpose in your walk with God, and that this space will be a source of encouragement as you grow in faith. Use this platform to connect with one another, share your thoughts, and find resources that help guide you on your journey.
`}
      />
      {/* Word From Bishop */}

      {/* Word From Chaplain */}
      <Section
        headerText={"Word from the Chaplain"}
        Image={Chaplain}
        name={"Ven. Ariire Ayo Kolawole"}
        title={"The Chaplain:"}
        text={`Welcome to your online space! It is with immense joy that I greet each one of you as we journey together in faith, hope, and love. This platform has been created with you in mind—a place where you can grow spiritually, connect with others, and find encouragement for the path ahead.

In this fast-paced world, it’s easy to feel overwhelmed or unsure of the future. But let me remind you: God has an incredible plan for your life. No matter where you are today, you are part of a bigger story—God’s story of love and transformation. 

As your Diocesan Chaplain, it is my prayer that through this space, you will be reminded of His unwavering love and your divine purpose.`}
      />
      {/* Word From Chaplain */}

      {/* Theme */}
      <div className="bg-[#eae7fd94] lg:flex flex-col justify-center space-y-5 lg:p-[50px] p-[30px]">
        <div className="lg:p-[40px] lg:m-0 mt-7 text-center">
          <p className="font-style text-yellow lg:text-[45px] text-[29px] p-0">
            2024 Diocesan Theme
          </p>
          <h1 className="font-header lg:text-[40px] text-[30px] text-primary-main">
            Fight the good fight of faith
          </h1>
          <p className="font-san text-[18px] text-reddish font-medium">
            1 Timothy 6:12
          </p>
        </div>
        {/* Stats */}
        <div className="p-[20px] grid lg:grid-cols-3 lg:space-x-5 lg:space-y-0 space-y-4">
          <div className="text-center">
            <p className="font-san text-reddish font-medium text-[16px]">
              Archdeaconries
            </p>
            <h1 className="text-[70px] font-bold font-dosis text-primary-main">
              <CountUp
                end={30}
                scrollSpyDelay={200}
                duration={2}
                enableScrollSpy="True"
                scrollSpyOnce="True"
              />
            </h1>
          </div>
          <div className="text-center">
            <p className="font-san text-reddish font-medium text-[16px]">
              Parishes
            </p>
            <h1 className="text-[70px] font-bold font-dosis text-primary-main">
              {" "}
              <CountUp
                end={300}
                scrollSpyDelay={200}
                duration={2}
                enableScrollSpy="True"
                scrollSpyOnce="True"
              />
              <span className="text-reddish">+</span>{" "}
            </h1>
          </div>
          <div className="text-center">
            <p className="font-san text-reddish font-medium text-[16px]">
              Youths
            </p>
            <h1 className="text-[70px] font-bold font-dosis text-primary-main">
              <CountUp
                end={50}
                scrollSpyDelay={200}
                duration={2}
                enableScrollSpy="True"
                scrollSpyOnce="True"
              />
              k<span className="text-reddish">+</span>
            </h1>
          </div>
        </div>
        {/* Stats */}
      </div>
      {/* Theme */}

      {/* Events */}
      <div className="grid bg-[#f6f6f634] p-3">
        <h1 className="font-header text-[34px] p-6 text-primary-main">
          Upcoming Events
        </h1>

        <div className="p-2 gap-5 grid lg:grid-cols-2 items-center">
          {EventData.map((event) => (
            <div
              key={event.id}
              className={`grid ${
                event.id === 1 ? "justify-center items-center" : ""
              }`}
            >
              <EventCard
                title={event.title}
                date={event.date}
                description={event.description}
                image={event.image}
                link={"/registration"}
                id={event.id}
              />
            </div>
          )).slice(0, 3)}
        </div>

        <div className="lg:p-5 grid place-content-center">
          <a
            href="/events"
            className="bg-reddish text-white font-rubik tracking-wide p-eventbutton rounded-full hover:bg-primary-main transition-all"
          >
            {" "}
            View All{" "}
          </a>
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
