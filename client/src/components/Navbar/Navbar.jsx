import React, { useState } from "react";
import { NavList } from "../../data";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CgClose, CgMenuLeftAlt } from "react-icons/cg";
import Logo from "../../data/images/nexus.png";
import { Button } from "@mui/joy";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Use replace to prevent user from clicking "back" into a private page
    navigate(`/login?redirect_to=${encodeURIComponent(pathname)}`, { replace: true });
  };

  const navLinkStyle = (path) => {
    return `${
      path === pathname
        ? "text-[#3586ff]" // Active link color
        : "text-white/80" // Default link color (matches your "Nexus" brand)
    } transition-colors hover:text-[#3586ff]`;
  };

  return (
    <nav className="z-[999] mx-auto flex h-[5rem] w-[100vw] max-w-7xl justify-between text-base md:w-full">
      <div className="ml-4 flex items-center">
        <Link to={"/"} className="flex justify-center items-center">
          <img src={Logo} alt="Nexus_Official" className="h-8 w-8" />
          <span className="mx-2 text-2xl uppercase text-white/80">Nexus</span>
        </Link>
      </div>
      <div className="relative flex items-center">
        
        {/* --- DESKTOP NAV --- */}
        <ul className="mr-5 hidden items-center gap-[3vw] text-sm md:flex lg:gap-12 lg:text-base">
          {NavList.map((item) => (
            <Link key={item.path} to={item.path}>
              <li className={navLinkStyle(item.path)}>
                {item.label}
              </li>
            </Link>
          ))}
          {token && (
            <Link key={'profile'} to={'/profile'}>
              <li className={navLinkStyle('/profile')}>
                {'Profile'}
              </li>
            </Link>
          )}
          {
            token ?
              <Button onClick={handleLogout}>Logout</Button>
              : <Button ><a href="/login">Login</a></Button>
          }
        </ul>
        {/* --- END DESKTOP NAV --- */}


        {/* --- MOBILE NAV --- */}
        {mobileMenu && (
          <ul
            className={`fixed top-0 left-0 right-0 z-[-1] flex h-screen w-full flex-col items-center gap-6 bg-black bg-opacity-90 py-14 pt-20 text-xl backdrop-blur-sm`}
            onClick={(e) => setMobileMenu(false)}
          >
            {NavList.map((item) => {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => setMobileMenu(false)}
                >
                  <li className={navLinkStyle(item.path)}>
                    {item.label}
                  </li>
                </Link>
              );
            })}
            {
              token && <Link
                key={'profile'}
                to={'/profile'}
                onClick={(e) => setMobileMenu(false)}
              >
                <li className={navLinkStyle('/profile')}>
                  {'Profile'}
                </li>
              </Link>
            }
            {
              token ?
                <Button onClick={handleLogout}>Logout</Button>
                : <Button ><a href="/login">Login</a></Button>
            }
          </ul>
        )}
        <div
          className="z-[99] mr-4 cursor-pointer rounded-full p-1 text-3xl text-white transition-all duration-300 hover:bg-white/20 active:scale-50 md:hidden"
          onClick={(e) => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <CgClose size={34} /> : <CgMenuLeftAlt size={34} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;