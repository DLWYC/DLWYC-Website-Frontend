import NavBar from "../../components/Nav_Bar/Nav_Bar"
import ProfileCard from "../../components/Cards/Profile"
import Header from "../../components/Header/Header"
import ChaplainsData from "../../data/Chaplains"
import Footer from '../../components/Footer/Footer'

const Chaplains = () =>{
     return(
          <div className="bg-[whitesmoke]">
               <NavBar/>
               <Header text="Meet Our Chaplains"/>
               <div className="grid grid-cols-1 w-full md:grid-cols-2 md:gap-x-3 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-3 gap-y-6  lg:p-[30px] p-[10px]">
                   {ChaplainsData.map(chaplain => (
                         <div key={chaplain.id}>
                              <ProfileCard 
                              name={chaplain.name}
                              job={chaplain.job}
                              image={chaplain.image} 
                              />
                         </div>
                   ))}
               </div>

        <Footer />

          </div>
     )
}

export default Chaplains