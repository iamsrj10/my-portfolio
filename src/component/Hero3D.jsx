// Hero.jsx (or wherever your hero component is)
import React from 'react';
import ThreeCube from './ThreeCube'; // path to the file above
import AvatarImg from '/path/to/avatar.jpg'; // your existing avatar for small screens

export default function Hero() {
  return (
    <section className="px-8 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-start gap-10">
        {/* left text column */}
        <div className="lg:w-2/3">
          <h1 className="text-6xl font-extrabold leading-tight text-white">Hi, I'm Rabin Jeo — <br/> a Web Developer</h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl">
            Hey, I’m Rabin — a web developer ... (your intro)
          </p>
          <div className="mt-6 flex gap-4">
            <a className="px-5 py-3 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-lg text-white">Contact</a>
            <a className="px-5 py-3 border rounded-lg text-gray-200">Projects</a>
          </div>
        </div>

        {/* right profile card */}
        <aside className="lg:w-1/3 bg-slate-900/60 rounded-2xl p-8 shadow-lg">
          {/* On small screens show avatar image for speed + clarity */}
          <div className="md:hidden flex justify-center mb-4">
            <img src={AvatarImg} alt="Rabin Jeo" className="w-36 h-36 rounded-full object-cover ring-4 ring-slate-800"/>
          </div>

          {/* On md+ screens show the ThreeCube */}
          <div className="hidden md:block">
            <div className="w-full h-[300px]">
              <ThreeCube size={300} labels={['React','Tailwind','Node','Three.js','JS','CSS']} />
            </div>
          </div>

          {/* keep the rest of the card content (name, icons, tagline) */}
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold text-white">Rabin Jeo</h3>
            <p className="text-sm text-gray-400 mt-1">MCA • Web Developer • Bangalore</p>
            <p className="text-xs text-gray-500 mt-3">Dream in design. Build in code.</p>

            <div className="mt-4 flex items-center justify-center gap-4">
              {/* social icons */}
              <a className="p-2 rounded-full bg-slate-800/40">LinkedIn</a>
              <a className="p-2 rounded-full bg-slate-800/40">GitHub</a>
              <a className="p-2 rounded-full bg-slate-800/40">Instagram</a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
