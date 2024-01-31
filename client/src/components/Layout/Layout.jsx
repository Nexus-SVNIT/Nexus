import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

const Layout = ({ children }) => {
  return (
    <div className=" h-full w-[100vw] scroll-smooth bg-[#000000] text-white backdrop-blur-sm md:w-full">
      <header className="sticky left-0 top-0 z-50 bg-[#000000] bg-opacity-75 backdrop-blur-sm backdrop-filter">
        <Navbar />
      </header>
      <main className="relative isolate z-10 mx-auto mb-10 w-[100vw] md:w-full">
        <ScrollToTop />
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
