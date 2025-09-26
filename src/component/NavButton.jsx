import React from "react";

export default function NavButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative group px-3 py-2 text-sm font-medium ${active ? "text-sky-600" : "text-gray-700"}`}
    >
      <span>{label}</span>
      <span
        className={`block h-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${active ? "scale-x-100" : ""}`}
      />
    </button>
  );
}
