import Logo from "../../assets/main_logo.svg";

const NavBar = () => {
  return (
    <div>
      <nav className="bg-white text-[#1e1e1ea2]">
        <a href="">
          <img src={Logo} alt="" className="[w-30px]" />
        </a>

          <ul className="space-x-2">
            <li>
              <a href="/" className="text-reddish">Home</a>
            </li>
            <li>
              <a href="/about" className="text-gray-600">About Us</a>
            </li>
            <li>
              <a href="/events" className="text-gray-600">Event</a>
            </li>
            <li>
              <a href="/gallery" className="text-gray-600">Gallery</a>
            </li>
            <li>
              <a href="/registration" className="text-gray-600">Registration</a>
            </li>
            <li>
              <a href="/gallery" className="text-gray-600">Gallery</a>
            </li>
          </ul>

      </nav>
    </div>
  );
};

export default NavBar;
