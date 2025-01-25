import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { FaBars, FaGem, FaHeart, FaCode, FaPen, FaUser } from "react-icons/fa";

const CustomSidebar = () => {
  const [collapsed, setCollapsed] = useState(true); // State to toggle sidebar

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ProSidebar
        collapsed={collapsed}
        className={`backdrop-blur-lg border-r border-gray-200`}
      >
        <Menu iconShape="circle">
          {/* Sidebar Toggle */}
          <MenuItem
            icon={<FaBars />}
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-gray-100"
          >
            {!collapsed && "Toggle"}
          </MenuItem>

          {/* Menu Items */}
          <MenuItem icon={<FaGem />} className="hover:bg-gray-100">
            {!collapsed && "Dashboard"}
          </MenuItem>
          <MenuItem icon={<FaCode />} className="hover:bg-gray-100">
            {!collapsed && "Coding Interview Exp"}
          </MenuItem>
          <MenuItem icon={<FaPen />} className="hover:bg-gray-100">
            {!collapsed && "Create Post"}
          </MenuItem>
          <MenuItem icon={<FaUser />} className="hover:bg-gray-100">
            {!collapsed && "Profile"}
          </MenuItem>

          {/* SubMenu */}
          <SubMenu title={!collapsed ? "Components" : ""} icon={<FaHeart />}>
            <MenuItem className="hover:bg-gray-100">Component 1</MenuItem>
            <MenuItem className="hover:bg-gray-100">Component 2</MenuItem>
          </SubMenu>
        </Menu>
      </ProSidebar>

      {/* Main Content Area */}
      <div className="flex-grow bg-gray-100 p-5">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <p className="mt-3 text-gray-700">
          This is the main content area. Customize it as per your requirements.
        </p>
      </div>
    </div>
  );
};

export default CustomSidebar;
