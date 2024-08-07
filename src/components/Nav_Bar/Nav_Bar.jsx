import Logo from "../../assets/main_logo.svg";

const NavBar = () => {
  return (
    <div>
      <nav className="bg-white text-[#1e1e1ea2]">
        <a href="">
          <img src={Logo} alt="" className="w-[250px]" />
        </a>

          <ul className="space-x-2 font-rubik">
            <li>
              <a href="/" className="text-reddish">Home</a>
            </li>
            <li>
              <a href="/about">About Us</a>
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
              <a href="/registration">Registration</a>
            </li>
          </ul>

      </nav>
    </div>
  );
};

export default NavBar;
