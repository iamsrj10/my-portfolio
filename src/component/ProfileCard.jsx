// src/component/ProfileCard.jsx
import React from "react";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { SiNaukri } from "react-icons/si";
import ThreeCube from "./ThreeCube";

export default function ProfileCard({
  avatar = "/rabj.png",
  name = "Rabin Jeo",
  subtitle = "MCA • Web Developer • Bangalore",
  linkedin = "https://www.linkedin.com/in/your-profile",
  github = "https://github.com/your-username",
  naukri = "https://www.naukri.com/your-profile",
  instagram = "https://www.instagram.com/your-profile",
}) {
  return (
    <aside className="hero-card relative w-full max-w-xs rounded-3xl bg-slate-800/60 border border-slate-700 p-4 shadow-inner">
      {/* Desktop: show 3D cube; Mobile: show avatar */}
      <div className="hidden md:block w-full h-[300px]">
        <ThreeCube size={300} />
      </div>

      <div className="md:hidden flex justify-center mb-4">
        <div className="w-36 h-36 rounded-full overflow-hidden ring-2 ring-slate-700">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Info section */}
      <div className="mt-4 flex items-center gap-4">
        <div className="hidden md:block w-14 h-14 rounded-full overflow-hidden ring-2 ring-slate-700">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>

        <div>
          <div className="font-semibold text-slate-100">{name}</div>
          <div className="text-sm text-slate-400">{subtitle}</div>
        </div>
      </div>

      {/* Social icons */}
      <div className="mt-4 flex items-center gap-3">
        <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 rounded-md hover:bg-slate-700 transition">
          <FaLinkedin className="w-5 h-5 text-sky-400" />
        </a>

        <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 rounded-md hover:bg-slate-700 transition">
          <FaGithub className="w-5 h-5 text-slate-100" />
        </a>

        <a href={naukri} target="_blank" rel="noopener noreferrer" aria-label="Naukri" className="p-2 rounded-md hover:bg-slate-700 transition">
          <SiNaukri className="w-5 h-5 text-amber-400" />
        </a>

        <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-md hover:bg-slate-700 transition">
          <FaInstagram className="w-5 h-5 text-pink-400" />
        </a>
      </div>
    </aside>
  );
}
