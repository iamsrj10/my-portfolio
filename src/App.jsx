// src/App.jsx
import React, { useState, useEffect } from "react";
import Navbar from "./component/Navbar";
import { motion } from "framer-motion";
import ToolCard from './component/ToolCard';
import CertificatesDeck from "./component/CertificatesDeck";
import { FaClock } from "react-icons/fa";





// add at top of App.jsx imports


import {
  FaMapMarkerAlt,
  FaLaptopCode,
  FaGraduationCap,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaBriefcase,
} from "react-icons/fa";

export default function App() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { root: null, threshold: 0.45 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // Contact form state & helpers
const [contact, setContact] = useState({ name: "", email: "", message: "" });
const [contactStatus, setContactStatus] = useState(null); // null | 'sending' | 'success' | 'error'
const [contactError, setContactError] = useState("");

const onContactChange = (e) => {
  const { name, value } = e.target;
  setContact((c) => ({ ...c, [name]: value }));
};

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const handleContactSubmit = async (e) => {
  e.preventDefault();
  setContactError("");
  setContactStatus(null);

  // client-side validation
  if (!contact.email || !validateEmail(contact.email)) {
    setContactError("Please enter a valid email address.");
    return;
  }
  if (!contact.message || !contact.message.trim()) {
    setContactError("Message cannot be blank.");
    return;
  }

  setContactStatus("sending");
  try {
    const res = await fetch("http://localhost:4000/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: contact.name.trim(),
    email: contact.email.trim(),
    message: contact.message.trim(),
  }),
});

    const json = await res.json();
    if (!res.ok) {
      setContactStatus("error");
      setContactError(json?.error || "Failed to send message.");
      return;
    }

    setContactStatus("success");
    setContact({ name: "", email: "", message: "" });
  } catch (err) {
    setContactStatus("error");
    setContactError("Network error. Try again later.");
    console.error("Contact submit error:", err);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-slate-100">
      {/* Header */}
      <header className="sticky top-4 z-40 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-3 flex items-center justify-between shadow-2xl border border-slate-700">
          {/* Left: brand initials */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center text-sm font-bold shadow">
                RJ
              </div>
            </div>
          </div>

          {/* Middle: Navbar */}
          <div className="flex-1 flex justify-center">
            <nav className="w-full max-w-3xl">
              <Navbar active={active} scrollTo={scrollTo} />
            </nav>
          </div>

          {/* Right: Resume & CTA */}
          <div className="flex items-center gap-3">
            <a
              href="/resume%20rabin.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow hover:opacity-95 text-sm"
            >
              Resume
            </a>
            <button
              onClick={() => scrollTo("projects")}
              className="px-4 py-2 rounded-lg border border-slate-700 text-sm hover:bg-slate-800/40"
            >
              See Work
            </button>
          </div>
        </div>
      </header>

      {/* Main hero + sections */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* About Section */}
        <section
          id="about"
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
        >
          {/* Left text */}
          <div className="md:col-span-7 space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Hi, I'm Rabin Jeo — <br /> a Web Developer
            </h1>
            <p className="text-slate-300 max-w-xl">
              Hey, I’m Rabin — a web developer and MCA student from Bangalore who
              loves turning ideas into interactive experiences. I specialize in
              React, Tailwind CSS, and Three.js, creating modern, responsive,
              and visually appealing web apps. For me, clean UI and smooth
              interactions are not just design choices but a passion. My aim is
              simple: build applications that are fast, functional, and leave a
              lasting impression.
            </p>

            <div className="flex gap-4 mt-6">
              <motion.button
                onClick={() => scrollTo("contact")}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45 }}
                whileHover={{ scale: 1.03 }}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-lg"
              >
                Contact
              </motion.button>

              <button
                onClick={() => scrollTo("projects")}
                className="px-6 py-3 rounded-lg border border-slate-700 text-slate-100/90 hover:bg-slate-800/40"
              >
                Projects
              </button>
            </div>
          </div>

          {/* Right big profile card */}
          <div className="md:col-span-5 flex justify-end">
            <div className="w-full max-w-md rounded-3xl bg-slate-800/60 border border-slate-700 p-8 shadow-inner">
              <div className="flex justify-center">
                <div className="w-44 h-44 rounded-full overflow-hidden ring-4 ring-slate-800/50">
                  <img
                    src="/rabj.png"
                    alt="Rabin"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="mt-6 text-center text-slate-200 space-y-2">
                <div className="flex justify-center gap-3 text-lg font-semibold">
                  <span className="flex items-center gap-1">
                    <FaGraduationCap className="text-pink-400" /> MCA
                  </span>
                  <span className="flex items-center gap-1">
                    <FaLaptopCode className="text-indigo-400" /> Web Developer
                  </span>
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-red-400" /> Bangalore
                  </span>
                </div>
                <p className="text-slate-400 mt-2">Dream in design. Build in code.</p>

                {/* Social Links row */}
                <div className="flex justify-center gap-4 mt-4">
                  <a
                    href="https://www.linkedin.com/in/rabinjeo-developer/"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-slate-900/30 hover:bg-slate-700 transition"
                  >
                    <FaLinkedin className="w-6 h-6 text-sky-400" />
                  </a>
                  <a
                    href="https://github.com/iamsrj10"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-slate-900/30 hover:bg-slate-700 transition"
                  >
                    <FaGithub className="w-6 h-6 text-slate-200" />
                  </a>
                  <a
                    href="https://www.naukri.com/mnjuser/profile?id=&altresid"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-slate-900/30 hover:bg-slate-700 transition flex items-center justify-center"
                  >
                    <FaBriefcase className="w-5 h-5 text-yellow-400" />
                  </a>
                  <a
                    href="https://www.instagram.com/iamsrj10/"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-slate-900/30 hover:bg-slate-700 transition"
                  >
                    <FaInstagram className="w-6 h-6 text-pink-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mt-20">
          <h2 className="text-2xl font-bold mb-6">Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <article className="p-6 rounded-xl border border-slate-700 bg-slate-800/40 card-hover">
  <h3 className="font-semibold text-white">
              AntiqueVault — E-commerce UI
              </h3>
              <p className="text-slate-400 mt-2">
              ● React + Tailwind UI to showcase collectibles.
              </p>
            </article>

            <article className="p-6 rounded-xl border border-slate-700 bg-slate-800/40 card-hover">
  <h3 className="font-semibold text-white">Online Agricultural Management System (E-Commerce Website)</h3>
              <p className="text-slate-400 mt-2">
                ● Developed an e-commerce platform for farmers and buyers.</p> 
                 <p className="text-slate-400 mt-2">
                ● Tech Stack: Frontend – HTML, CSS, PHP | Backend – MySQL 
              </p>
            </article>
           <article className="p-6 rounded-xl border border-slate-700 bg-slate-800/40 card-hover">
  <h3 className="font-semibold text-white">Eterna – Vintage Collection Website (E-Commerce Website)</h3>
              <p className="text-slate-400 mt-2">
               ● Built a product catalog & shopping interface for vintage collections.</p> 
                 <p className="text-slate-400 mt-2">
               ● Tech Stack: Frontend – React.js | Backend – MongoDB
              </p>
            </article>
            <article className="p-6 rounded-xl border border-slate-700 bg-slate-800/40 card-hover">
  <h3 className="font-semibold text-white">Weather & Chatbot Assistant App </h3>
              <p className="text-slate-400 mt-2">
               ● Created an interactive web app that provides weather updates and a chatbot for user queries.
              </p>
              <p className="text-slate-400 mt-2">
               ● Tech Stack: React.js.
              </p>
            </article>
          <article className="p-6 rounded-xl border border-slate-700 bg-slate-800/40 card-hover">
  <h3 className="font-semibold text-white">Aquarium Website (E-Commerce Website) </h3>
              <p className="text-slate-400 mt-2">
              ● Designed an e-commerce website for aquarium products with dynamic product management. 
              </p>
              <p className="text-slate-400 mt-2">
              ● Tech Stack: Frontend – HTML, CSS, PHP | Backend – MySQL 
              </p>
            </article>
            
          </div>
        </section>

        {/* Achievements */}
        <section id="achievements" className="scroll-mt-24 mt-16">
          <h2 className="text-2xl font-bold mb-4">Achievements</h2>
          <div className="grid md:grid-cols-3 gap-4">
           <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center card-hover">
  <FaClock className="text-orange-500 text-4xl" />
              <p className="mt-3 font-medium">Wearable Health Monitor</p>
              <div>
                (International Conference On Current Trends In Information
                Technologies)
              </div>
            </div>
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center card-hover">
  <FaClock className="text-orange-500 text-4xl" />Orchestrated Nss Camp!</div>
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center card-hover">
  <FaClock className="text-orange-500 text-4xl" />
              Finance Secretary in Loyola College
            </div>
             <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center card-hover">
  <FaClock className="text-orange-500 text-4xl" />
              Conducted a department festival in Loyola College in 2024
            </div>
            
          </div>
        </section>

        <section id="certificates" className="scroll-mt-24 mt-16">
  <CertificatesDeck />
</section>


        {/* Skills */}
        <section id="skills" className="scroll-mt-24 mt-16">
          <h2 className="text-2xl font-bold mb-6">Skills</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {/* Row 1 */}
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-orange-500 text-3xl font-bold">{"</>"}</span>
              <p className="mt-3 font-medium">HTML</p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-sky-400 text-3xl font-bold">CSS</span>
              <p className="mt-3 font-medium">CSS</p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-yellow-300 text-3xl font-bold">JS</span>
              <p className="mt-3 font-medium">JavaScript</p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-sky-400 text-3xl font-bold">TS</span>
              <p className="mt-3 font-medium">TypeScript</p>
            </div>

            {/* Row 2 */}
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-sky-400 text-3xl font-bold">React</span>
              <p className="mt-3 font-medium">React.js</p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-cyan-400 text-3xl font-bold">Tailwind</span>
              <p className="mt-3 font-medium">Tailwind CSS</p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-purple-400 text-3xl font-bold">3JS</span>
              <p className="mt-3 font-medium">Three.js</p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-blue-400 text-3xl font-bold">PHP</span>
              <p className="mt-3 font-medium">PHP</p>
            </div>

            {/* Row 3 */}
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-purple-400 text-3xl font-bold">.NET</span>
              <p className="mt-3 font-medium">.NET Framework</p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-yellow-400 text-3xl font-bold">SQL</span>
              <p className="mt-3 font-medium">MySQL</p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-green-400 text-3xl font-bold">MDB</span>
              <p className="mt-3 font-medium">MongoDB</p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-green-500 text-3xl font-bold">Node</span>
              <p className="mt-3 font-medium">Node.js</p>
            </div>

            {/* Row 4 */}
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-yellow-300 text-3xl font-bold">Py</span>
              <p className="mt-3 font-medium">Python</p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-red-400 text-3xl font-bold">Java</span>
              <p className="mt-3 font-medium">Java</p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-blue-300 text-3xl font-bold">C</span>
              <p className="mt-3 font-medium">C</p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-indigo-300 text-3xl font-bold">C++</span>
              <p className="mt-3 font-medium">C++</p>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section id="tools" className="scroll-mt-24 mt-16">
          <h2 className="text-2xl font-bold mb-6">Software Development Tools</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
  <ToolCard short="VS" title="Visual Studio Code" subtitle="Editor" size={220} />
  <ToolCard short="AS" title="Android Studio" subtitle="IDE" size={220} />
  <ToolCard short="GH" title="GitHub" subtitle="Version control" size={220} />
  <ToolCard short="FB" title="Firebase" subtitle="Backend platform" size={220} />
</div>


        </section>

       {/* Contact */}
<section id="contact" className="scroll-mt-24 mt-16">
  <h2 className="text-2xl font-bold mb-4">Contact</h2>

  <form
    onSubmit={handleContactSubmit}
    className="grid md:grid-cols-2 gap-6 bg-slate-800/30 p-6 rounded-xl border border-slate-700"
  >
    <input
      name="name"
      value={contact.name}
      onChange={onContactChange}
      className="p-3 border rounded bg-slate-900/30"
      placeholder="Your name"
      autoComplete="name"
    />
    <input
      name="email"
      value={contact.email}
      onChange={onContactChange}
      className="p-3 border rounded bg-slate-900/30"
      placeholder="Email"
      autoComplete="email"
      required
    />
    <textarea
      name="message"
      value={contact.message}
      onChange={onContactChange}
      className="p-3 border rounded md:col-span-2 bg-slate-900/30"
      rows="5"
      placeholder="Message"
      required
    />
    <div className="md:col-span-2 flex flex-col gap-3">
      {contactError && (
        <div className="text-sm text-red-400">{contactError}</div>
      )}
      {contactStatus === "success" && (
        <div className="text-sm text-green-400">Message sent — thanks!</div>
      )}
      <button
        type="submit"
        className="px-4 py-2 bg-pink-600 text-white rounded disabled:opacity-70"
        disabled={contactStatus === "sending"}
      >
        {contactStatus === "sending" ? "Sending..." : "Send"}
      </button>
    </div>
  </form>
</section>

      </main>
    </div>
  );
}
