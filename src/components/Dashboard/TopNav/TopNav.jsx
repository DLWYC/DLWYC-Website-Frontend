import { Menu } from "lucide-react";


const DashboardTopNav = ({OpenSideBar}) => {
     return(
          <div className="flex items-center  justify-between py-3 border-b">
                    <button className="md:hidden" onClick={OpenSideBar}>
                      <Menu className="w-6 h-6" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-700">Welcome, Samuel 👋</h2>
                    <div className="flex items-center space-x-4">
                      <img
                        src="https://via.placeholder.com/40"
                        alt="profile"
                        className="w-10 h-10 rounded-full"
                      />
                    </div>

                  </div>
     )
}



export default DashboardTopNav;