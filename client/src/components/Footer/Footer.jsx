import { Link } from "react-router-dom";
import "./footer.css";
import Logo from "../../data/images/nexus.png";

const Footer = () => {
  return (
    <div className="container-footer relative flex flex-col flex-wrap justify-between gap-y-10 bg-gradient-to-b from-[#020617] via-black to-black px-4 py-16 md:px-32 border-t border-white/5">
      <div className="z-10">
        <div className="wave absolute -top-16 left-0 z-50 h-[4rem] w-full" id="wave1" />
        <div className="wave absolute -top-16 left-0 z-50 h-[4rem] w-full" id="wave2" />
        <div className="wave absolute -top-16 left-0 z-50 h-[4rem] w-full" id="wave3" />
        <div className="wave absolute -top-16 left-0 z-50 h-[4rem] w-full" id="wave4" />
      </div>
      <div className="mx-auto flex w-full flex-col gap-4 xl:flex-row xl:gap-0 mt-8">
        <div className="w-[100%] xl:w-[40rem]">
          <h2 className="flex items-center text-sm md:text-base font-semibold text-zinc-200">
            <img
              src={Logo}
              alt="Nexus"
              className="mx-4 my-4 h-12 w-12 md:h-16 md:w-16 opacity-90 transition-opacity hover:opacity-100"
            />
            <span className="leading-snug">
              NEXUS <br />
              <span className="text-zinc-400 font-normal text-xs md:text-sm">Departmental Cell of DoCSE and DoAI</span>
              <br />
              <span className="text-zinc-400 font-normal text-xs md:text-sm">National Institute of Technology, Surat</span>
            </span>
          </h2>

          <p className="mt-8 font-mono text-sm leading-relaxed text-zinc-500 md:mt-4 md:pl-6">
            Empowering CSE & AI students at SVNIT, Nexus is a community that
            cultivates coding excellence, fosters diverse extracurricular
            interests, and champions holistic growth, shaping educational
            journeys with passion and purpose.
          </p>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-10 sm:flex-row sm:items-start sm:gap-0 md:justify-center md:gap-[25%] mt-8 xl:mt-0">
          <div className="flex flex-col gap-4 px-1 text-center md:px-8 md:text-left">
            <h4 className="whitespace-nowrap text-lg font-semibold tracking-wide text-zinc-200">
              Quick Links
            </h4>
            <div className="flex gap-10 md:gap-12 mt-2">
              <ul className="flex flex-col gap-3 text-left text-sm font-medium text-zinc-400">
                <Link className="transition-colors hover:text-white" to={"/"}>Home</Link>
                <Link className="transition-colors hover:text-white" to={"/team"}>Team</Link>
                <Link className="transition-colors hover:text-white" to={"/achievements"}>Achievements</Link>
                <Link className="transition-colors hover:text-white" to={"/events"}>Events</Link>
                <Link className="transition-colors hover:text-white" to={"/forms"}>Forms</Link>
              </ul>
              <ul className="flex flex-col gap-3 text-left text-sm font-medium text-zinc-400">
                <Link className="transition-colors hover:text-white" to={"/alumni-network"}>Alumni Network</Link>
                <Link className="transition-colors hover:text-white" to={"/projects"}>Projects</Link>
                <Link className="transition-colors hover:text-white" to={"/coding"}>Coding Leaderboard</Link>
                <Link className="transition-colors hover:text-white" to={"/interview-experiences"}>Interview Experiences</Link>
                <Link className="transition-colors hover:text-white" to={"/about"}>About</Link>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-4 px-8 text-center md:px-0">
            <h4 className="text-lg font-semibold tracking-wide text-zinc-200">Social Media</h4>
            <ul className="flex flex-col gap-3 text-sm font-medium text-zinc-400 mt-2">
              <Link className="transition-colors hover:text-white" to={"https://www.instagram.com/nexus_svnit"} target="_blank">Instagram</Link>
              <Link className="transition-colors hover:text-white" to={"https://www.linkedin.com/company/nexus-svnit/"} target="_blank">LinkedIn</Link>
              <Link className="transition-colors hover:text-white" to={"mailto:nexus@coed.svnit.ac.in"}>nexus@coed.svnit.ac.in</Link>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-white/5 pt-6 text-center font-mono text-xs text-zinc-600 md:text-sm tracking-wide">
        Made with <span className="animate-pulse text-red-500 mx-1">❤️</span> by All Time Developers, NEXUS - NIT Surat •
        © {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default Footer;
