import { FaBars, FaAngleDown } from "react-icons/fa";
import Logo from "../../assets/main_logo.svg";
import { FaXmark } from "react-icons/fa6";

const NavBar = () => {
  const changeNav = () => {
    window.addEventListener("scroll", () => {
      let navBar = document.querySelector("nav");
      navBar.classList.toggle("stickyNav", window.scrollY > 40);
    });
  };

  changeNav();

  const menuOpen = () => {
    document.getElementById("navLinks").style.display = "flex";
  };
  const menuClose = () => {
    document.getElementById("navLinks").style.display = "none";
  };
  const showMiniNav = () => {
    document.getElementById("miniNav").style.display = "grid";
  };
  const removeMiniNav = () => {
    document.getElementById("miniNav").style.display = "none";
  };

  return (
    <div>
      <nav className="nav ">
        <a href="/">
          <img src={Logo} alt="" className="w-[250px]" />
        </a>

        <div className="navLinks lg:flex hidden" id="navLinks">
          <FaXmark
            className="text-white hidden text-[35px] font-bold cursor-pointer absolute top-10 right-10"
            id="iconmultiply"
            onClick={menuClose}
          />

          <ul className="lg:space-x-2 font-rubik mainNav">
            <li>
              <a href="/">Home</a>
            </li>


            <li
              className="text-center relative cursor-pointer miniNav"
              onClick={showMiniNav} onMouseLeave={removeMiniNav}
            >
              <div className="p-3 space-x-2 flex items-center justify-center"><p >About Us</p> <FaAngleDown /> </div>
              <ul id="miniNav" className="lg:absolute hidden relative" >
                <li className="grid p-0">
                  <a className="border" href="/about">
                    Chaplaincy
                  </a>
                </li>
                <li className="grid p-0">
                  <a className="border" href="/about/chaplains">
                    Our Chaplains
                  </a>
                </li>
                <li className="grid p-0">
                  <a className="border " href="/about/chairmans">
                    Our Archdeaconry Leaders
                  </a>
                </li>
              </ul>
            </li>



            <li>
              <a href="/events">Event</a>
            </li>
            <li>
              <a href="/gallery">Gallery</a>
            </li>
            <li>
              <a href="/contact-us">Contact Us</a>
            </li>
            <li>
              {/* <a href="/registration">Registration</a> */}
            </li>
          </ul>
        </div>

        <FaBars
          className="text-primary-main lg:hidden flex text-[25px]  cursor-pointer"
          onClick={menuOpen}
          id="icon"
        />
      </nav>
    </div>
  );
};

export default NavBar;
