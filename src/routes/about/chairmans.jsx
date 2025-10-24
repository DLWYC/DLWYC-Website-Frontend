import { createFileRoute } from '@tanstack/react-router'
import ProfileCard from "../../components/Cards/Profile"
import Header from "../../components/Header/Header"
import ChairmanData from "../../data/Chairmans"

export const Route = createFileRoute('/about/chairmans')({
  component: Chairmen,
})

function Chairmen() {
  return(
          <div className="bg-[whitesmoke]">
            <Header text="Archdeaconry Leaders"/>
               <div className="grid grid-cols-1 w-full md:grid-cols-2 md:gap-x-3 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-3 gap-y-6  lg:p-[30px] p-[10px]">
                   {ChairmanData.map(chairman => (
                         <div key={chairman.id}>
                              <ProfileCard 
                              name={chairman.name}
                              job={chairman.job}
                              image={chairman.image} 
                              />
                         </div>
                   ))}
               </div>


          </div>
     )
}
