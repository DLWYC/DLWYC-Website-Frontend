import NavBar from "../../components/Nav_Bar/Nav_Bar";
import topleft from "../../assets/aboutpage/top_left.jpg";
import bottomleft from "../../assets/aboutpage/bottom_left.jpg";
import topright from "../../assets/aboutpage/top_right.jpg";
import bottomright from "../../assets/aboutpage/bottom_right.jpg";
import vision from "../../assets/aboutpage/vision.jpg";
import mission from "../../assets/aboutpage/mission.jpg";
import group42 from "../../assets/aboutpage/Group 42.svg";
import group46 from "../../assets/aboutpage/Group 46.svg";
import Testimony from "../../components/Cards/Testimony";
import "swiper/css";
import TestimonyData from "../../data/Testimonies";
import Footer from "../../components/Footer/Footer";
import { Mousewheel, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const About = () => {
  const controlledSwiper = null;
  return (
    <div className="">
      <NavBar />
      <div className="flex flex-col lg:p-[10px] p-[15px] items-center justify-center space-y-4">
        <div className="flex lg:flex-row flex-col-reverse lg:space-x-6 mt-16 justify-between items-center lg:p-2">
          <div className="flex lg:basis-[50%] lg:h-[75vh] h-[50vh] space-x-5  w-full mt-6 lg:mt-0">
            <div className=" space-y-5 flex flex-col basis-[50%] ">
              <div
                className=" rounded-[25px] basis-[40%] bg-no-repeat bg-center bg-cover "
                style={{ backgroundImage: `url(${topleft})` }}
              ></div>
              <div
                className="rounded-[25px] basis-[60%] bg-no-repeat bg-center bg-cover "
                style={{ backgroundImage: `url(${bottomleft})` }}
              ></div>
            </div>

            <div className="flex flex-col basis-[50%] space-y-5 ">
              <div
                className="rounded-[25px] basis-[60%] bg-no-repeat bg-center bg-cover "
                style={{ backgroundImage: `url(${topright})` }}
              ></div>
              <div
                className="rounded-[25px] basis-[40%] bg-no-repeat bg-center bg-cover "
                style={{ backgroundImage: `url(${bottomright})` }}
              ></div>
            </div>
          </div>

          <div className="basis-[50%] lg:mt-0 mt-[20px]">
            <h1 className="text-red-700 font-style font-semibold text-[30px]">
              About Us
            </h1>
            <h2
              className="text-[35px] font-rubik-moonrock text-yellow font-extralight"
              id=""
            >
              <span className="stroke-yellow">Welcome</span> to the Diocese of
              Lagos West Youth Chaplaincy!.
            </h2>
            <p className="font-grotesk leading-[30px] text-text-paragraph">
              At the heart of our mission lies a commitment to nurturing the
              spiritual, emotional, and personal growth of the youth within our
              Diocese. We believe in empowering young people to lead
              Christ-centered lives, equipping them with the knowledge, faith,
              and tools they need to thrive in today’s world.
              <br />
              <br />
              Our chaplaincy serves as a beacon of hope, community, and faith
              for youth across the Diocese of Lagos West. Through engaging
              programs, impactful teachings, and meaningful fellowship, we
              foster an environment where young minds can connect with God,
              deepen their faith, and develop strong Christian values.
            </p>
          </div>
        </div>

        <p className="font-grotesk leading-[30px] text-text-paragraph p-3">
          <span className="text-red-700 font-style font-semibold text-[30px]">
            We aim to:
          </span>
          <br />
          Guide Spiritual Growth: By providing biblically grounded teachings,
          discipleship opportunities, and vibrant worship experiences, we
          encourage our youth to grow deeper in their relationship with Christ.
          Build a Community of Faith: Through youth-friendly gatherings, events,
          and mentorship, we create a safe and welcoming space for young people
          to share, learn, and support one another. Inspire Leadership and
          Service: By identifying and nurturing God-given talents, we inspire
          our youth to step into roles of leadership and service within the
          church and the community. In a rapidly changing world, we recognize
          the challenges young people face and are committed to being a source
          of spiritual guidance and encouragement. We stand as a reminder of
          God’s unchanging love, calling our youth to remain steadfast in their
          faith while making a positive impact in their spheres of influence.
          Join us on this journey of spiritual growth, purpose, and
          transformation. Together, we are building a generation of strong,
          faithful, and empowered youth ready to shine the light of Christ in
          the world.
        </p>
      </div>

      <div className="bg-primary-main flex flex-col mt-4 ">
        {/*  */}
        <div className="flex lg:flex-row flex-col-reverse">
          <div className=" basis-[50%]  flex h-[65vh]">
            <img
              src={vision}
              alt=""
              className="w-full object-cover object-center"
            />
          </div>

          <div className="flex flex-col justify-center  basis-[50%] p-[30px] space-y-14 ">
            <div className="">
              <img src={group46} alt="" className=" w-[90px]" />
            </div>
            <div className="">
              <p className="text-white font-rubik tracking-wide text-[20px] leading-[40px]">
                To be the leading Diocese in the Church of Nigeria in preparing
                the Nation for the second coming of our Lord Jesus Christ.
              </p>
            </div>
            <div className="flex justify-between items-end">
              <p className="text-white lg:text-[40px] text-[30px] font-style">
                Our Vision
              </p>
              <img src={group42} alt="" />
            </div>
          </div>
        </div>
        {/*  */}

        <div className="flex lg:flex-row flex-col">
          <div className="basis-[50%] flex flex-col items-center justify-center p-[40px] space-y-4">
            <div className="flex justify-between w-full  items-end">
              <img src={group42} alt="" />
              <h1 className="text-white lg:text-[40px] text-[30px] font-style">
                Our Mission
              </h1>
            </div>
            <ul className="text-white font-rubik 2xl:text-[24px] space-y-5 list-disc">
              <li>
                To ensure a sustained growth in the number of churches and
                worshippers within the Diocese
              </li>
              <li>
                To continue to enhance the mode of worship, teach and preach the
                word of God in all our churches thereby creating worshippers fit
                for the kingdom of Heaven.
              </li>
              <li>
                To develop and inspire in every church the principles of
                self-sufficiency and Christian generosity, thereby ensuring a
                strong and viable Diocese
              </li>
              <li>
                To assist every member in the understanding and practice of the
                39 Articles of our faith.
              </li>
              <li>
                To develop and inspire in every church the principles of
                self-sufficiency and Christian generosity, thereby ensuring a
                strong and viable Diocese
              </li>
              <li>
                To continue to promote peaceful and cordial relationship with
                the other Dioceses, in order to ensure the success of our common
              </li>
            </ul>

            <div className="w-full flex justify-end">
              <img src={group46} alt="" className=" w-[90px]" />
            </div>
          </div>

          <div className=" basis-[50%] flex ">
            <img src={mission} alt="" className="w-full object-cover" />
          </div>
        </div>
      </div>
      <div className="text-center font-bold">
        <h1
          className="lg:text-[45px] text-[30px] font-header font-normal mt-10 mb-5 text-transparent"
          id="about_header"
        >
          TESTIMONIES FROM OUR YOUTH
        </h1>
      </div>
      <div className="p-[10px]">
        <Swiper
          className="flex items-center justify-center"
          modules={[Mousewheel, Autoplay]}
          mousewheel={true}
          spaceBetween={20}
          navigation
          controller={{ control: controlledSwiper }}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log("slide change")}
          breakpoints={{
            // when window width is >= 640px
            640: {
              slidesPerView: 1,
            },
            // when window width is >= 768px
            768: {
              slidesPerView: 2,
            },
            // when window width is >= 1024px
            1024: {
              slidesPerView: 2,
            },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
        >
          {TestimonyData.map((testimony) => (
            <SwiperSlide key={testimony.id}>
              <div className="flex">
                <Testimony
                  name={testimony.name}
                  testimony={testimony.testimonial}
                  title={testimony.title}
                  image={testimony.image}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Footer />
    </div>
  );
};

export default About;
