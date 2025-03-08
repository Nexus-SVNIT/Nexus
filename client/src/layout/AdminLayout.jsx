import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";
import axios from "axios";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (
    localStorage.getItem("core-token-exp") &&
    localStorage.getItem("core-token-exp") < Date.now()
  ) {
    localStorage.removeItem("core-token");
    localStorage.removeItem("core-token-exp");
  }
  
  const token = localStorage.getItem("core-token");
  if (!token) {
    const currentPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/core/admin/login?redirect_to=${currentPath}`} replace />;
  }

  const verifyAdmin = async () => {
    try {
      const res = await axios.get(process.env.REACT_APP_BACKEND_BASE_URL + '/api/core/verify', {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!res.data.success) {
        const currentPath = encodeURIComponent(location.pathname + location.search);
        window.location.href = `/core/admin/login?redirect_to=${currentPath}`;
      }
    } catch (error) {
      const currentPath = encodeURIComponent(location.pathname + location.search);
      window.location.href = `/core/admin/login?redirect_to=${currentPath}`;
    }
  };

  verifyAdmin();

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
