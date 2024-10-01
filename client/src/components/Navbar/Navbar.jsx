import React, { useState } from "react";
import { NavList } from "../../data";
import { Link, Navigate, useLocation } from "react-router-dom";
import { CgClose, CgMenuLeftAlt } from "react-icons/cg";
import Logo from "../../data/images/nexus.png";
import { Button } from "@mui/joy";
const Navbar = () => {
  const { pathname } = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);
  const token = localStorage.getItem('token');
  return (
    <nav className="z-[999] mx-auto flex h-[5rem] w-[100vw] max-w-7xl justify-between text-base md:w-full">
      <div className="ml-4 flex items-center">
        <Link to={"/"}>
          <img src={Logo} alt="Nexus_Official" className="h-8 w-8" />
        </Link>
        <span className="mx-2 text-2xl uppercase text-white/80">Nexus</span>
      </div>
      <div className="relative flex items-center">
        <ul className="mr-5 hidden items-center gap-[3vw] text-sm md:flex lg:gap-12 lg:text-base">
          {NavList.map((item) => {
            return (
              <Link to={item.path} key={item.path}>
                <li
                  key={item.path}
                  className={`${item.path === pathname
                    ? "text-[#3586ff] underline underline-offset-8"
                    : "text-white"
                    } transition-colors`}
                >
                  {item.label}
                </li>
              </Link>
            );

          })}
          {
            token && <Link to={'profile'} key={'profile'}>
              <li
                key={'profile'}
                className={`${'profile' === pathname
                  ? "text-[#3586ff] underline underline-offset-8"
                  : "text-white"
                  } transition-colors`}
              >
                {'Profile'}
              </li>
            </Link>
          }
          {
            token ?
              <Button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</Button>
              : <Button ><a href="/login">Login</a></Button>
          }
        </ul>

        {mobileMenu && (
          <ul
            className={`fixed top-0 float-right flex h-[200vh] flex-col items-center gap-6 bg-black bg-opacity-80 py-14 pt-20 text-xl`}
            onClick={(e) => setMobileMenu(false)}
          >
            {NavList.map((item) => {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => setMobileMenu(false)}
                >
                  <li
                    key={item.path}
                    className={`${item.path === pathname
                      ? "text-[#3586ff] underline underline-offset-8"
                      : "text-white"
                      } transition-colors hover:text-[#3586ff]`}
                  >
                    {item.label}
                  </li>
                </Link>
              );
            })}
            {
              token && <Link
                key={'profile'}
                to={'profile'}
                onClick={(e) => setMobileMenu(false)}
              >
                <li
                  key={'profile'}
                  className={`${'profile' === pathname
                    ? "text-[#3586ff] underline underline-offset-8"
                    : "text-white"
                    } transition-colors hover:text-[#3586ff]`}
                >
                  {'Profile'}
                </li>
              </Link>
            }
            {
              token ?
                <Button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</Button>
                : <Button ><a href="/login">Login</a></Button>
            }
          </ul>
        )}
        <div
          className="z-[99] mr-4 cursor-pointer rounded-full p-1 text-3xl  transition-all duration-300 hover:bg-white/20 active:scale-50 md:hidden"
          onClick={(e) => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <CgClose size={34} /> : <CgMenuLeftAlt size={34} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
