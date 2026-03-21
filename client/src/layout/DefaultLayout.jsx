import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "../components";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import CustomSideBar from "../components/SideNavigationBar/SideBar";

const DefaultLayout = () => {
  return (
    <div className="bg-black min-h-screen">
      <div className="hidden md:block">
        <CustomSideBar />
      </div>
      <div className="flex min-h-screen w-full flex-col bg-[#000000] text-white md:pl-[80px]">
        <header className="sticky left-0 top-0 z-50 bg-[#000000]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <Navbar />
        </header>
        <main className="relative isolate z-10 flex-1 w-full bg-[#000000]">
          <ScrollToTop />
          <Outlet />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default DefaultLayout;
