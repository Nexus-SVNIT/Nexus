import { Link } from "react-router-dom";
import Logo from "../../data/images/nexus.png";

const Footer = () => {
  return (
    <footer className="bg-[#09090b] border-t border-zinc-800/50 text-zinc-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Brand & Description */}
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="Nexus" className="h-10 w-10 opacity-90 transition-opacity hover:opacity-100" />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-wide text-zinc-100">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">NEXUS</span>
                </span>
                <span className="text-xs font-medium text-zinc-500">DoCSE and DoAI • NIT Surat</span>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-400 font-sans">
              Empowering students at SVNIT. We cultivate coding excellence, foster diverse extracurricular interests, and champion holistic growth, shaping educational journeys with passion and purpose.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/nexus_svnit" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-[#54d2f0] transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
              <a href="https://www.linkedin.com/company/nexus-svnit/" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-[#54d2f0] transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
              <a href="mailto:nexus@coed.svnit.ac.in" className="text-zinc-500 hover:text-[#54d2f0] transition-colors">
                <span className="sr-only">Email</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">Explore</h3>
                <ul className="mt-6 flex flex-col gap-4">
                  <li><Link to="/" className="text-sm leading-6 text-zinc-400 hover:text-[#54d2f0] transition-colors">Home</Link></li>
                  <li><Link to="/events" className="text-sm leading-6 text-zinc-400 hover:text-[#54d2f0] transition-colors">Events</Link></li>
                  <li><Link to="/achievements" className="text-sm leading-6 text-zinc-400 hover:text-[#54d2f0] transition-colors">Achievements</Link></li>
                  <li><Link to="/forms" className="text-sm leading-6 text-zinc-400 hover:text-[#54d2f0] transition-colors">Forms</Link></li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">Community</h3>
                <ul className="mt-6 flex flex-col gap-4">
                  <li><Link to="/team" className="text-sm leading-6 text-zinc-400 hover:text-[#54d2f0] transition-colors">Team</Link></li>
                  <li><Link to="/alumni-network" className="text-sm leading-6 text-zinc-400 hover:text-[#54d2f0] transition-colors">Alumni Network</Link></li>
                  <li><Link to="/about" className="text-sm leading-6 text-zinc-400 hover:text-[#54d2f0] transition-colors">About Us</Link></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">Resources</h3>
                <ul className="mt-6 flex flex-col gap-4">
                  <li><Link to="/projects" className="text-sm leading-6 text-zinc-400 hover:text-[#54d2f0] transition-colors">Projects</Link></li>
                  <li><Link to="/coding" className="text-sm leading-6 text-zinc-400 hover:text-[#54d2f0] transition-colors">Coding Leaderboard</Link></li>
                  <li><Link to="/interview-experiences" className="text-sm leading-6 text-zinc-400 hover:text-[#54d2f0] transition-colors">Interview Experiences</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-16 border-t border-zinc-800/50 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-zinc-500 font-mono tracking-wide">
            Made with <span className="animate-pulse text-red-500 mx-1">❤</span> by All Time Developers, NEXUS SVNIT • &copy; {new Date().getFullYear()} NEXUS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
