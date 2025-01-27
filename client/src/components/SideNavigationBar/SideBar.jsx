import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
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
      icon: <FaHome />,
      link: "/",
    },
    {
      title: "Team",
      icon: <FaPeopleGroup />,
      link: "/team",
    },
    {
      title: "Achievements",
      icon: <FaTrophy />,
      link: "/achievements",
    },
    {
      title: "Events",
      icon: <FaCalendar />,
      link: "/events",
    },
    {
      title: "Forms",
      icon: <FaFileLines />,
      link: "/forms",
    },
    {
      title: "Connect",
      icon: <FaUserGraduate />,
      link: "/connect",
    },
    {
      title: "Projects",
      icon: <FaFileCode />,
      link: "/projects",
    },
    {
      title: "Coding Profile LeaderBoard",
      icon: <FaLaptopCode />,
      link: "/coding",
    },
    {
      title: "Interview Experience",
      icon: <FaUserTie />,
      link: "/interview-experiences",
    },
    {
      title: "Profile",
      icon: <FaUser />,
      link: "/profile",
    },
    {
      title: "About",
      icon: <FaInfo />,
      link: "/about",
    },
    {
      title: "Login",
      icon: <FaRightToBracket />,
      link: "/login",
    },
  ];

  return (
    <ProSidebar
      collapsed={collapsed}
      className="fixed left-0 top-0 z-9999 h-screen bg-black-2 bg-opacity-90"
    >
      <Menu iconShape="circle" className={`absolute left-0 top-0 text-white`}>
        {/* Sidebar Toggle */}
        <div className="flex justify-evenly">
          {!collapsed && (
            <MenuItem className="hover:bg-gray-100">
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
              {!collapsed && item.title}
              <Link to={item.link} />
            </MenuItem>
          );
        })}
        {/* SubMenu */}
        {/* <SubMenu title={!collapsed ? "Components" : ""} icon={<FaHeart />}>
          <MenuItem className="hover:bg-gray-100">Component 1</MenuItem>
          <MenuItem className="hover:bg-gray-100">Component 2</MenuItem>
        </SubMenu> */}
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
