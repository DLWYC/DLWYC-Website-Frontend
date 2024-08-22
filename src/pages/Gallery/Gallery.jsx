import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import NavBar from "../../components/Nav_Bar/Nav_Bar";
import images from "../../data/Gallery"

const Gallery = () =>{
     return(

          <div className="">
     <NavBar />


     <Header text="Gallery" />

          <div className="p-5 sm:p-8">
               <div className=" columns-1 gap-5 sm:columns-1 sm:gap-8 md:columns-3 lg:columns-3 [&>img:not(:first-child)]:mt-4 overflow-hidden">
               {images.map((image) => {
                    return <img src={image.image} alt="People" key={image.key} className="rounded-lg"/>;
               })}
               </div>
          </div>

          <Footer />
     </div>
     )
     
}

export default Gallery
