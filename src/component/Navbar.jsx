// src/component/Navbar.jsx
import React from "react";

export default function Navbar({ active, scrollTo }) {
  const items = [
    { id: "about", label: "About Me" },
    { id: "projects", label: "Projects" },
    { id: "achievements", label: "Achievements" },
    { id: "certificates", label: "Certificates" },
    { id: "skills", label: "Skills" }, 
    { id: "tools", label: "Tools" },        
    { id: "contact", label: "Contact" },
  ];

  return (
    <ul className="flex items-center justify-between gap-6 text-slate-300">
      {items.map((it) => (
        <li key={it.id}>
          <button
            onClick={() => scrollTo(it.id)}
            className={`px-3 py-2 rounded-md text-sm ${
              active === it.id
                ? "text-white underline decoration-pink-500 decoration-2 underline-offset-4"
                : "text-slate-400 hover:text-slate-100"
            }`}
          >
            {it.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
