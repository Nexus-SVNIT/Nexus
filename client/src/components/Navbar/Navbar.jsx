import { useState } from "react";
import { NavList } from "../../data";
import { Link, useLocation } from "react-router-dom";
import { CgClose, CgMenuLeftAlt } from "react-icons/cg";
import Logo from "../../data/images/nexus.png";
import { Button } from "@mui/joy";
import { useUser } from "../../context/userContext";
const Navbar = () => {
  const { pathname } = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);
  const { user, logOut } = useUser();

  return (
    <nav className="z-[999] mx-auto flex h-[5rem] w-[100vw] max-w-7xl justify-between text-base md:w-full">
      <div className="ml-4 flex items-center">
        <Link to={"/"} className="flex justify-center">
          <img src={Logo} alt="Nexus_Official" className="h-8 w-8" />
        <span className="mx-2 text-2xl uppercase text-white/80">Nexus</span>
        </Link>
      </div>
      <div className="relative flex items-center">
        <ul className="mr-5 hidden items-center gap-[3vw] text-sm md:flex lg:gap-12 lg:text-base">
          {
            user ?
              <Button onClick={logOut}>Logout</Button>
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
              user && <Link
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
              user ?
                <Button onClick={logOut}>Logout</Button>
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
