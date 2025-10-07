import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css"; // Default styles
import {
  FaBars,
  FaUser,
  FaHome,
  FaTrophy,
  FaCalendar,
  FaUserGraduate,
  FaInfo,
  FaFileCode,
  FaLaptopCode,
  FaUserTie,
} from "react-icons/fa";
import {
  FaFileLines,
  FaPeopleGroup,
  FaRightFromBracket,
  FaRightToBracket,
  FaX,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Logo from "../../data/images/nexus.png";
import { useUser } from "../../context/userContext";

const CustomSidebar = () => {
  const [collapsed, setCollapsed] = useState(true); // State to toggle sidebar
  const [ignoreHover, setIgnoreHover] = useState(false); // Prevents hover expand after X
  const { user } = useUser();

  const menuList = [
    {
      title: "Home",
      icon: <FaHome className="text-2xl" />,
      link: "/",
    },
    {
      title: "Team",
      icon: <FaPeopleGroup className="text-2xl" />,
      link: "/team",
    },
    {
      title: "Achievements",
      icon: <FaTrophy className="text-2xl" />,
      link: "/achievements",
    },
    {
      title: "Events",
      icon: <FaCalendar className="text-2xl" />,
      link: "/events",
    },
    {
      title: "Forms",
      icon: <FaFileLines className="text-2xl" />,
      link: "/forms",
    },
    {
      title: "Alumni Network",
      icon: <FaUserGraduate className="text-2xl" />,
      link: "/alumni-network",
    },
    {
      title: "Projects",
      icon: <FaFileCode className="text-2xl" />,
      link: "/projects",
    },
    {
      title: "Coding Profile LeaderBoard",
      icon: <FaLaptopCode className="text-2xl" />,
      link: "/coding",
    },
    {
      title: "Interview Experience",
      icon: <FaUserTie className="text-2xl" />,
      link: "/interview-experiences",
    },
    {
      title: "Profile",
      icon: <FaUser className="text-2xl" />,
      link: "/profile",
    },
    {
      title: "About",
      icon: <FaInfo className="text-2xl" />,
      link: "/about",
    },
  ];

  // Handlers for hover logic
  const handleMouseEnter = () => {
    if (!ignoreHover) setCollapsed(false);
  };
  const handleMouseLeave = () => {
    setCollapsed(true);
    setIgnoreHover(false); // Reset ignoreHover on mouse leave
  };

  return (
    <ProSidebar
      collapsed={collapsed}
      className="fixed left-0 top-0 z-9999 h-screen bg-black-2 bg-opacity-95"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4 py-3">
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              className="focus:outline-none flex items-center justify-center w-10 h-10 rounded-full bg-[#232323] my-4"
              aria-label="Open sidebar"
            >
              <FaBars size={16} className="text-white" />
            </button>
          ) : (
            <>
              <div className="flex items-center px-4 py-9 h-10">
                <Link to={"/"}>
                  <img src={Logo} alt="Nexus_Official" className="h-8 w-8" />
                </Link>
                <span className="mx-2 text-xl uppercase text-white/80">
                  Nexus
                </span>
              </div>
              <button
                onClick={() => {
                  setCollapsed(true);
                  setIgnoreHover(true); // Prevent hover expand until mouse leaves
                }}
                className="focus:outline-none flex items-center justify-center w-10 h-10 rounded-full bg-[#232323] ml-auto hover:bg-gray-100 my-2 transition-transform duration-200 hover:scale-110 hover:text-blue-500"
                aria-label="Close sidebar"
              >
                <FaX size={16} className="text-white" />
              </button>
            </>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <Menu iconShape="circle" className="overflow-visible">
            {/* Menu Items */}
            {menuList.map((item, index) => {
              return (
                <MenuItem
                  key={item.title || item.link || index}
                  icon={React.cloneElement(item.icon, {
                    size: 16,
                    className: "hover-icon text-white",
                  })}
                  className="hover:bg-gray-100 my-2 transition-transform duration-200 hover:scale-110 hover:text-blue-500"
                  title={item.title}
                  onClick={() => setCollapsed(true)}
                >
                  {/* Bubble Animation Effect with Blue Color */}
                  <div className="absolute left-0 top-0 h-full w-full scale-0 rounded-full bg-blue-500/30 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"></div>

                  {/* Hover Box for Menu Item Name (Right Side and Above the Screen) */}
                  {collapsed && (
                    <div className="absolute -top-6 left-2 z-50 whitespace-nowrap rounded-md bg-white px-2 py-1 text-sm text-black opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {item.title}
                    </div>
                  )}

                  {!collapsed && (
                    <span className="ml-4 text-lg font-medium">
                      {item.title}
                    </span>
                  )}
                  <Link to={item.link} />
                </MenuItem>
              );
            })}
            {/* <SubMenu title={!collapsed ? "Components" : ""} icon={<FaHeart />}> */}
            {/*   <MenuItem className="hover:bg-gray-100">Component 1</MenuItem> */}
            {/*   <MenuItem className="hover:bg-gray-100">Component 2</MenuItem> */}
            {/* </SubMenu> */}

            {user ? (
              <MenuItem
                icon={<FaRightFromBracket className="hover-icon text-white" />}
                className="hover:bg-gray-100 my-2 transition-transform duration-200 hover:scale-110 hover:text-blue-500"
                title={"Logout"}
                onClick={() => {
                  localStorage.removeItem("token"); // Remove token from storage
                  window.location.href = `/login?redirect_to=${encodeURIComponent(window.location.pathname)}`; // Redirect to login page
                  setCollapsed(true);
                }}
              >
                {!collapsed && (
                  <span className="ml-4 text-lg font-medium">Logout</span>
                )}
              </MenuItem>
            ) : (
              <MenuItem
                icon={<FaRightToBracket className="hover-icon text-white" />}
                className="hover:bg-gray-100 my-2 transition-transform duration-200 hover:scale-110 hover:text-blue-500"
                title={"Login"}
                onClick={() => setCollapsed(true)}
              >
                {!collapsed && (
                  <span className="ml-4 text-lg font-medium">Login</span>
                )}
                <Link to={"/login"} />
              </MenuItem>
            )}
          </Menu>
        </div>
      </div>
      <style>{`
        .pro-sidebar > .pro-sidebar-inner {
          background-color: transparent;
        }
      `}</style>
    </ProSidebar>
  );
};

export default CustomSidebar;