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
  FaRightToBracket,
  FaX,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Logo from "../../data/images/nexus.png";

const CustomSidebar = () => {
  const [collapsed, setCollapsed] = useState(true); // State to toggle sidebar

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
      title: "Connect",
      icon: <FaUserGraduate className="text-2xl" />,
      link: "/connect",
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
    {
      title: "Login",
      icon: <FaRightToBracket className="text-2xl" />,
      link: "/login",
    },
  ];

  return (
    <ProSidebar
      collapsed={collapsed}
      className="!bg-slate-950 fixed left-0 top-0 z-9999 h-screen text-white transition-all duration-300 overflow-visible"
    >
      <Menu iconShape="circle" className="absolute left-0 top-0 overflow-visible">
        {/* Sidebar Toggle and Logo Section */}
        <div className="flex items-center justify-between p-4">
          {/* Logo and Nexus Text (Visible when sidebar is expanded) */}
          {!collapsed && (
            <div className="flex items-center">
              <Link to={"/"}>
                <img
                  src={Logo}
                  alt="Nexus_Official"
                  className="h-8 w-8 rounded-full"
                />
              </Link>
              <span className="ml-2 text-xl font-semibold uppercase text-white/80">
                Nexus
              </span>
            </div>
          )}

          {/* Toggle Button */}
          <MenuItem
            icon={collapsed ? <FaBars size={20} /> : <FaX size={20} />}
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-gray-100 hover:scale-110 transition-transform duration-200 hover:text-blue-500 hover-icon"
          ></MenuItem>
        </div>

        {/* Menu Items */}
        {menuList.map((item, index) => {
          return (
            <MenuItem
              icon={React.cloneElement(item.icon, { size: 20, className: "hover-icon" })}
              className="hover:bg-gray-100 hover:scale-110 transition-transform duration-200 hover:text-blue-500"
              title={item.title}
            >
              {/* Bubble Animation Effect with Blue Color */}
              <div className="absolute left-0 top-0 h-full w-full rounded-full bg-blue-500/30 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></div>

              {/* Hover Box for Menu Item Name (Right Side and Above the Screen) */}
              {collapsed && (
                <div className="absolute left-2 -top-6 bg-white text-black px-2 py-1 rounded-md opacity-0 text-sm group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  {item.title}
                </div>
              )}

              {!collapsed && (
                <span className="ml-4 text-lg font-medium">{item.title}</span>
              )}
              <Link to={item.link} />
            </MenuItem>
          );
        })}
      </Menu>
      <style jsx>{`
          .pro-sidebar > .pro-sidebar-inner{
            background-color: transparent;
          }
        `}</style>
    </ProSidebar>
  );
};

export default CustomSidebar;