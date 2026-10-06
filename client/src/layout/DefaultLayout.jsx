import { Outlet, useLocation } from "react-router-dom";
import { Footer, Navbar } from "../components";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import CustomSideBar from "../components/SideNavigationBar/SideBar";
import GradientWaves from "../components/Events/GradientWaves";

const DefaultLayout = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <div className={`min-h-screen overflow-x-hidden ${isHomePage ? "bg-black" : "bg-[#060818]"}`}>
      {/* Animated gradient waves background for all pages except the homepage */}
      {!isHomePage && (
        <div
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
          style={{ background: '#060818' }}
        >
          <GradientWaves
            horizonColor="#183B8F"
            waveColor="#4F6FE8"
            crestColor="#9BDFFF"
            speed={0.6}
            amplitude={1.85}
            waveScale={0.65}
            waveRatio={0.75}
            swell={25}
            turbulence={12}
            tilt={1}
            zoom={1}
            height={5.5}
            fogDepth={20}
            detail="medium"
            brightness={0.75}
            opacity={0.7}
            mouseInteraction
            parallaxStrength={0.3}
            grain
            grainIntensity={0.03}
          />
        </div>
      )}

      <div>
        <CustomSideBar />
      </div>
      <div className={`flex min-h-screen w-full flex-col text-white md:pl-[80px] ${isHomePage ? "bg-[#000000]" : "bg-transparent"}`}>
        <header className={`hidden md:block sticky left-0 top-0 z-50 backdrop-blur-md px-4 sm:px-6 lg:px-8 ${isHomePage ? "bg-[#000000]/80" : "bg-[#060818]/70 border-b border-white/5"}`}>
          <Navbar />
        </header>
        <main className={`relative isolate z-10 flex-1 w-full pt-16 md:pt-0 ${isHomePage ? "bg-[#000000]" : "bg-transparent"}`}>
          <ScrollToTop />
          <div key={pathname} className="animate-fadeIn">
            <Outlet />
          </div>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default DefaultLayout;

