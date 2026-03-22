import { HiUsers } from "react-icons/hi2";
import { LuBuilding } from "react-icons/lu";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaUserPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Button } from "@mui/joy";

export const AlumniHero = () => {
  return (
    <div className="relative max-h-screen overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
            <HiOutlineSparkles className="h-4 w-4" />
            Alumni Network
          </div>

          <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Connect with Our
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Alumni Community
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400">
            Discover and connect with our talented alumni working at top
            companies worldwide. Build meaningful professional relationships and
            grow your network.
          </p>

          <div className="mx-auto flex max-w-3xl items-center justify-center text-xl">
            <Link to="/alumni/signup">
              <Button className="gap-2">
                <FaUserPlus className="text-sm" />
                <span>Join Alumni Network</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
