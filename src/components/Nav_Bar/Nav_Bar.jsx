import { FaBars, FaAngleDown } from "react-icons/fa";
import Logo from "../../assets/main_logo.svg";
import { FaXmark } from "react-icons/fa6";
import { useEffect, useState } from "react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMiniNavOpen, setIsMiniNavOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Handle scroll for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Cleanup: remove event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menuOpen = () => {
    setIsMenuOpen(true);
  };

  const menuClose = () => {
    setIsMenuOpen(false);
  };

  const showMiniNav = () => {
    setIsMiniNavOpen(true);
  };

  const removeMiniNav = () => {
    setIsMiniNavOpen(false);
  };

  return (
    <div>
      <nav className={`nav ${isSticky ? 'stickyNav' : ''}`}>
        <a href="/">
          <img src={Logo} alt="" className="w-[250px]" />
        </a>

        <div 
          className={`navLinks lg:flex ${isMenuOpen ? 'flex' : 'hidden'}`} 
          id="navLinks"
          style={{ display: isMenuOpen ? 'flex' : '' }}
        >
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
              onMouseEnter={showMiniNav}
              onMouseLeave={removeMiniNav}
            >
              <div className="p-3 space-x-2 flex items-center justify-center">
                <p>About Us</p> <FaAngleDown />
              </div>
              <ul 
                id="miniNav"
                className={`lg:absolute lg:top-full lg:left-0 relative`}
                style={{ 
                  display: isMiniNavOpen ? 'grid' : 'none',
                  width: '230px',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'white'
                }}
              >
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
                  <a className="border" href="/about/chairmans">
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
              <a href="/userlogin">Login</a>
            </li>
          </ul>
        </div>

        <FaBars
          className="text-primary-main lg:hidden flex text-[25px] cursor-pointer"
          onClick={menuOpen}
          id="icon"
        />
      </nav>
    </div>
  );
};

export default NavBar;