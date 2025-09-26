import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBg({ className = "" }) {
  const particlesInit = useCallback(async (engine) => {
    // loads tsparticles bundle
    await loadFull(engine);
  }, []);

  const options = {
    fullScreen: { enable: false }, // we will position it ourselves
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        repulse: { distance: 120 },
        push: { quantity: 3 },
      },
    },
    particles: {
      number: { value: 35, density: { enable: true, area: 800 } },
      color: { value: ["#7c3aed", "#ec4899", "#60a5fa"] },
      shape: { type: "circle" },
      opacity: { value: 0.15 },
      size: { value: { min: 2, max: 6 } },
      links: {
        enable: true,
        distance: 160,
        color: "#111827",
        opacity: 0.06,
        width: 1,
      },
      move: { enable: true, speed: 0.8, direction: "none", outModes: "out" },
    },
    detectRetina: true,
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden>
      <Particles init={particlesInit} options={options} />
    </div>
  );
}
