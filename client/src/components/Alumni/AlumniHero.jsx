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
        <div className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-blue-400">
            <HiOutlineSparkles className="h-4 w-4" />
            Alumni Network
          </div>

          <h1 className="text-foreground text-4xl font-bold md:text-6xl">
            Connect with Our
            <span className="block bg-gradient-to-r from-blue-400 to-blue-400/80 bg-clip-text text-transparent">
              Alumni Community
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-xl leading-relaxed md:mx-20 lg:mx-auto">
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
