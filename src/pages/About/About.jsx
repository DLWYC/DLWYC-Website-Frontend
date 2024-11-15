import NavBar from "../../components/Nav_Bar/Nav_Bar";
import topleft from "../../assets/aboutpage/top_left.jpg";
import bottomleft from "../../assets/aboutpage/bottom_left.jpg";
import topright from "../../assets/aboutpage/top_right.jpg";
import bottomright from "../../assets/aboutpage/bottom_right.jpg";
import vision from "../../assets/aboutpage/vision.jpg";
import mission from "../../assets/aboutpage/mission.jpg";
import group42 from "../../assets/aboutpage/Group 42.svg";
import group46 from "../../assets/aboutpage/Group 46.svg";
import Testimony from "../../components/Cards/Testimony"
import TestimonyData from '../../data/Testimonies'
import Footer from "../../components/Footer/Footer"


const About = () => {
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
              <span className="stroke-yellow">WELCOME</span> HERE IS WHAT WE ARE.
            </h2>
            <p className="font-grotesk leading-[30px] text-text-paragraph">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit,
              ipsum cumque iusto maxime dolore dignissimos sapiente quas
              debitis, quia nesciunt eius accusantium omnis nam! Accusamus ea
              accusantium iure at consectetur! Lorem ipsum dolor sit, amet
              consectetur adipisicing elit. Illo, in vitae repellat eum
              exercitationem velit optio. Cupiditate quo error expedita omnis
              doloribus aperiam. Laudantium, quibusdam temporibus expedita
              tempora natus sequi! Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Quia alias repudiandae sint, dolore quis culpa
              repellendus error qui eaque totam asperiores!. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, beatae recusandae maxime eos assumenda veniam incidunt culpa facilis repellendus, similique magnam quaerat odio. Incidunt nihil dolores quaerat dolorum rem, velit nostrum aliquam, eum cum omnis a repellat magni quis tenetur assumenda in repudiandae ab earum temporibus itaque numquam ipsa unde deleniti? Nisi quo obcaecati expedita, quod illum dicta animi recusandae.
            </p>
          </div>
        </div>

        <p className="font-grotesk leading-[30px] text-text-paragraph">
           Doloribus suscipit est dolorum modi voluptas ab maiores expedita ducimus illo ea, dicta repellat. Repudiandae harum facilis eveniet quos dicta, quaerat sunt reiciendis et nam nobis voluptatem ullam qui sapiente, numquam illum, saepe sequi dolore minus consectetur pariatur! Numquam veritatis consequatur, impedit repellendus, nemo minima nam esse voluptas totam, error iure at reprehenderit hic earum unde repudiandae voluptates officia obcaecati dicta. Officiis. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci at nostrum eum voluptas mollitia architecto et sequi exercitationem repellat amet, illum, ducimus vel aperiam eaque delectus odio cum quaerat consectetur.
           Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus voluptatum ut alias sit, odit dolorum amet blanditiis temporibus officiis quod modi consequuntur laborum facere deleniti quibusdam tempore culpa reiciendis. Vel dolorem quod consequatur hic sed adipisci corporis fugit excepturi inventore ullam ducimus aperiam totam magni ex, rem labore asperiores nemo. Soluta inventore illum totam aspernatur porro officiis, laudantium ab sequi minima sit eveniet quam animi autem voluptatum amet nam cumque perferendis impedit quaerat assumenda corporis in dolorum. Exercitationem maxime quisquam officiis assumenda recusandae tempora, sit at consectetur, velit vitae repellat odio! Mollitia, unde nulla? Ea doloremque libero porro vero facilis sed ad mollitia hic praesentium soluta! Illum ratione, animi odio aliquam ut nobis mollitia deserunt reiciendis ullam nostrum expedita? Eligendi officiis cumque saepe.
        </p>
      </div>






      <div className="bg-primary-main flex flex-col ">

          {/*  */}
        <div className="flex lg:flex-row flex-col-reverse">
          <div className=" basis-[50%]  flex h-[65vh]" >
            <img src={vision} alt="" className="w-full object-cover object-center" />
          </div>

          <div className="flex flex-col justify-center  basis-[50%] p-[30px] space-y-14 ">

          <div className="">
            <img src={group46} alt="" className=" w-[90px]"/>
          </div>
          <div className="">
            <p className="text-white font-rubik tracking-wide text-[20px] leading-[40px]">
              To be the leading Diocese in the Church of Nigeria in {" "}
              preparing the Nation for the second coming of our Lord 
              Jesus Christ.
            </p>
          </div>
            <div className="flex justify-between items-end">
              <p className="text-white lg:text-[40px] text-[30px] font-style">Our Vision</p>
              <img src={group42} alt="" />
            </div>

          </div>
        </div>
          {/*  */}


        <div className="flex lg:flex-row flex-col">
          <div className="basis-[50%] flex flex-col items-center justify-center p-[40px] space-y-4">

            <div className="flex justify-between w-full  items-end">
              <img src={group42} alt="" />
              <h1 className="text-white lg:text-[40px] text-[30px] font-style">Our Mission</h1>
            </div>
            <ul className="text-white font-rubik 2xl:text-[24px] space-y-5 list-disc">
               <li>
               To ensure a sustained growth in the number of churches
                    and worshippers within the Diocese
               </li>
               <li>To continue to enhance the mode of worship, teach and preach the
                word of God in all our churches thereby creating
                worshippers fit for the kingdom of Heaven.</li>
               <li>
               To develop and inspire in every church the principles of
                self-sufficiency  and Christian generosity, thereby
                ensuring a strong and viable Diocese 
               </li>
               <li>
               To assist every member in the understanding and practice of
               the 39 Articles of our faith. 
               </li>
               <li>
               To develop and inspire in every church the principles of
                self-sufficiency  and Christian generosity, thereby
                ensuring a strong and viable Diocese
               </li>
               <li>
               To continue to promote peaceful and cordial relationship with
                the  other Dioceses, in order to ensure the success of our
                common
               </li>
            </ul>

            <div className="w-full flex justify-end">
            <img src={group46} alt="" className=" w-[90px]"/>
          </div>
              </div>

              <div className=" basis-[50%] flex " >
            <img src={mission} alt="" className="w-full object-cover" />
          </div>

        </div>
      </div>
      <div className="text-center font-bold">
        <h1 className="lg:text-[45px] text-[30px] font-header font-normal mt-10 mb-5 text-transparent" id="about_header">
          TESTIMONIES FROM OUR YOUTH
        </h1>
      </div>
      <div className="grid lg:grid-cols-2 gap-5 lg:p-7 p-3">

        {TestimonyData.map((testimony)=>(
          <div className="flex" key={testimony.id}>
            <Testimony name={testimony.name} testimony={testimony.testimonial} title={testimony.title} image={testimony.image} /> 
          </div>
        ))}

        <div className="flex basis-[50%]  bg-slate-200"></div>
      </div>



        <Footer />


    </div>
  );
};

export default About;
