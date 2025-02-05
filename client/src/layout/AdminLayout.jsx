import { useEffect, useState } from "react";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (
    localStorage.getItem("core-token-exp") &&
    localStorage.getItem("core-token-exp") < Date.now()
  ) {
    localStorage.removeItem("core-token");
    localStorage.removeItem("core-token-exp");
  }
  const token = localStorage.getItem("core-token");
  if (!token) return <Navigate to={"/core/admin/login"} replace />;
  const verifyAdmin = async () => {
    const res = await axios.get(process.env.REACT_APP_BACKEND_BASE_URL + '/api/core/verify', {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!res.data.success){
		window.location.href = '/core/admin/login'
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
