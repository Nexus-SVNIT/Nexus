import { Link, useLocation } from "react-router-dom";
import Logo from "../../data/images/nexus.png";

const NAV = [
  {
    heading: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "Events", to: "/events" },
      { label: "Achievements", to: "/achievements" },
      { label: "Forms", to: "/forms" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Team", to: "/team" },
      { label: "Alumni Network", to: "/alumni-network" },
      { label: "About Us", to: "/about" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Projects", to: "/projects" },
      { label: "Coding Leaderboard", to: "/coding" },
      { label: "Interview Experiences", to: "/interview-experiences" },
      { label: "Study Material", to: "/study-material" },
    ],
  },
];

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const Footer = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <footer
      className={`relative z-20 overflow-hidden text-zinc-300 ${
        isHomePage ? "bg-black" : "bg-[#060818]/95 backdrop-blur-md"
      }`}
    >
      {/* ── Animated top border ───────────────────────────────────── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
      <div
        className="h-px w-full opacity-40"
        style={{
          background:
            "linear-gradient(90deg, transparent, #22d3ee, #3b82f6, #22d3ee, transparent)",
          animation: "footerGlow 4s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes footerGlow {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.7; }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        .footer-link {
          position: relative;
          display: inline-block;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, #3b82f6, #22d3ee);
          transition: width 0.3s ease;
        }
        .footer-link:hover::after {
          width: 100%;
        }
        .back-to-top:hover .arrow-icon {
          animation: floatUp 0.8s ease-in-out infinite;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-12">

          {/* ── Brand ─────────────────────────────────────────────── */}
          <div className="space-y-6 xl:col-span-1">
            {/* Logo + wordmark */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md" />
                <img
                  src={Logo}
                  alt="Nexus"
                  className="relative h-11 w-11 object-contain drop-shadow-lg"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-widest bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  NEXUS
                </span>
                <span className="text-[10px] font-medium text-zinc-500 tracking-widest uppercase mt-0.5">
                  DoCSE & DoAI · NIT Surat
                </span>
              </div>
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
              Empowering students at SVNIT. We cultivate coding excellence,
              foster diverse extracurricular interests, and champion holistic
              growth, shaping educational journeys with passion and purpose.
            </p>

            {/* Email pill */}
            <a
              href="mailto:nexus@coed.svnit.ac.in"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/60 px-4 py-2 text-xs font-mono text-zinc-400 transition-all hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-zinc-800/60"
            >
              <svg className="h-3.5 w-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              nexus@coed.svnit.ac.in
            </a>

            {/* Social icons */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/nexus_svnit"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-900/50 text-zinc-500 transition-all duration-300 hover:border-[#cd486b]/60 hover:bg-[#cd486b]/10 hover:text-[#cd486b] hover:shadow-[0_0_16px_rgba(205,72,107,0.25)]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/nexus-svnit/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-900/50 text-zinc-500 transition-all duration-300 hover:border-[#0077b5]/60 hover:bg-[#0077b5]/10 hover:text-[#0077b5] hover:shadow-[0_0_16px_rgba(0,119,181,0.25)]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://github.com/Bharat0509/Nexus"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-900/50 text-zinc-500 transition-all duration-300 hover:border-zinc-400/50 hover:bg-zinc-800/60 hover:text-zinc-200 hover:shadow-[0_0_16px_rgba(255,255,255,0.08)]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Nav links ─────────────────────────────────────────── */}
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 xl:col-span-2 xl:mt-0">
            {NAV.map((col) => (
              <div key={col.heading}>
                <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-widest mb-4">
                  {col.heading}
                </h3>
                <ul className="flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        className="footer-link text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-200"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Big watermark wordmark ────────────────────────────────── */}
        <div
          className="pointer-events-none select-none mt-8 flex justify-center overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="text-[6rem] sm:text-[9rem] md:text-[12rem] font-black tracking-[0.15em] leading-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            NEXUS
          </span>
        </div>

        {/* ── Copyright bar ─────────────────────────────────────────── */}
        <div className="mt-2 flex flex-col items-center justify-between gap-3 border-t border-zinc-800/50 pt-6 sm:flex-row">
          <p className="text-xs font-mono tracking-wide text-zinc-600">
            Made with{" "}
            <span className="animate-pulse text-red-500 mx-0.5">❤</span> by All
            Time Developers, NEXUS SVNIT &nbsp;•&nbsp; &copy;{" "}
            {new Date().getFullYear()} NEXUS
          </p>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="back-to-top group flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-900/60 px-4 py-1.5 text-xs font-medium text-zinc-500 transition-all hover:border-cyan-500/40 hover:text-cyan-300"
          >
            <span className="arrow-icon inline-block">↑</span>
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
