import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faList,
  faTable,
  faUser,
  faCog,
  faTrophy,
  faFileAlt,
  faUserGraduate,
  faCalendarPlus,
  faUserPlus,
  faBell,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

const navigationLinks = [
  {
    path: "/core/admin",
    icon: faHome,
    label: "Dashboard"
  },
  {
    type: "dropdown",
    icon: faList,
    label: "Forms",
    children: [
      { path: "/core/admin/forms/all", label: "All Forms" },
      { path: "/core/admin/forms/create", label: "Create Form" },
    ]
  },
  {
    path: "/core/admin/responses",
    icon: faTable,
    label: "Responses"
  },
  {
    path: "/core/admin/add-project",
    icon: faUser,
    label: "Add Project"
  },
  {
    path: "/core/admin/create-panel",
    icon: faCog,
    label: "Create Panel"
  },
  {
    path: "/core/admin/verify-achievements",
    icon: faTrophy,
    label: "Verify Achievements"
  },
  {
    path: "/core/admin/verify-posts",
    icon: faFileAlt,
    label: "Verify Post"
  },
  {
    path: "/core/admin/verify-alumni",
    icon: faUserGraduate,
    label: "Verify Alumni"
  },
  {
    path: "/core/admin/create-event",
    icon: faCalendarPlus,
    label: "Create Event"
  },
  {
    path: "/core/admin/add-team-member",
    icon: faUserPlus,
    label: "Add Team Member"
  },
  {
    path: "/core/admin/general-notification",
    icon: faBell,
    label: "Notify Message"
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const renderNavLink = (item) => {
    if (item.type === "dropdown") {
      return (
        <SidebarLinkGroup
          key={item.label}
          activeCondition={pathname.includes("forms")}
        >
          {(handleClick, open) => (
            <React.Fragment>
              <NavLink
                to="#"
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname.includes("forms") && "bg-graydark dark:bg-meta-4"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                }}
              >
                <FontAwesomeIcon icon={item.icon} className="text-current w-4.5 h-4.5" />
                {item.label}
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className={`absolute left-auto right-4 top-1/2 -translate-y-1/2 ${open && "rotate-180"}`}
                />
              </NavLink>
              <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
                <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                  {item.children.map((child) => (
                    <li key={child.path}>
                      <NavLink
                        to={child.path}
                        className={({ isActive }) =>
                          "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                          (isActive && "!text-white")
                        }
                      >
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </React.Fragment>
          )}
        </SidebarLinkGroup>
      );
    }

    return (
      <li key={item.path}>
        <NavLink
          to={item.path}
          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
            pathname.includes(item.path.split("/").pop()) && "bg-graydark dark:bg-meta-4"
          }`}
        >
          <FontAwesomeIcon icon={item.icon} className="text-current w-4.5 h-4.5" />
          {item.label}
        </NavLink>
      </li>
    );
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img
            src={
              "https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC"
            }
            alt="Logo"
            className="w-1/2"
          />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-current w-5 h-5" />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {navigationLinks.map(renderNavLink)}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
