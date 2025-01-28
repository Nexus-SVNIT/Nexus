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
  ];

  return (
    <ProSidebar
      collapsed={collapsed}
      className="fixed left-0 top-0 z-9999 h-screen bg-black-2 bg-opacity-95"
    >
      <Menu iconShape="circle" className="absolute left-0 top-0 overflow-visible">
        {/* Sidebar Toggle and Logo Section */}
        <div className="flex items-center justify-between p-4">
          {/* Logo and Nexus Text (Visible when sidebar is expanded) */}
          {!collapsed && (
            <MenuItem
              className="hover:bg-gray-100"
              onClick={() => setCollapsed(true)}
            >
              <div className="ml-4 flex items-center">
                <Link to={"/"}>
                  <img
                    src={Logo}
                    alt="Nexus_Official"
                    className="min-h-8 min-w-8"
                  />
                </Link>
                <span className="mx-2 text-xl uppercase text-white/80">
                  Nexus
                </span>
              </div>
            </MenuItem>
          )}

          {/* Toggle Button */}
          <MenuItem
            icon={collapsed ? <FaBars size={20} /> : <FaX size={20} />}
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-gray-100 hover-icon transition-transform duration-200 hover:scale-110 hover:text-blue-500"
          ></MenuItem>
        </div>

        {/* Menu Items */}
        {menuList.map((item, index) => {
          return (
            <MenuItem
              icon={React.cloneElement(item.icon, {
                size: 20,
                className: "hover-icon",
              })}
              className="hover:bg-gray-100 transition-transform duration-200 hover:scale-110 hover:text-blue-500"
              title={item.title}
              onClick={() => setCollapsed(true)}
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
        {/* SubMenu */}
        {/* <SubMenu title={!collapsed ? "Components" : ""} icon={<FaHeart />}>
          <MenuItem className="hover:bg-gray-100">Component 1</MenuItem>
          <MenuItem className="hover:bg-gray-100">Component 2</MenuItem>
        </SubMenu> */}

        {localStorage.getItem("token") ? (
          <MenuItem
            icon={React.cloneElement(<FaRightFromBracket />, {
              size: 20,
              className: "hover-icon",
            })}
            className="hover:bg-gray-100 transition-transform duration-200 hover:scale-110 hover:text-blue-500"
            title={"Logout"}
            onClick={() => setCollapsed(true)}
          >
            {!collapsed && "Logout"}
            <Link to={"/login"} />
          </MenuItem>
        ) : (
          <MenuItem
            icon={React.cloneElement(<FaRightToBracket />, {
              size: 20,
              className: "hover-icon",
            })}
            className="hover:bg-gray-100 transition-transform duration-200 hover:scale-110 hover:text-blue-500"
            title={"Login"}
            onClick={() => setCollapsed(true)}
          >
            {!collapsed && "Login"}
            <Link to={"/login"} />
          </MenuItem>
        )}
      </Menu>
      <style jsx>{`
        .pro-sidebar > .pro-sidebar-inner {
          background-color: transparent;
        }
      `}</style>
    </ProSidebar>
  );
};

export default CustomSidebar;