// src/components/CertificatesDeck.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function CertificatesDeck({ jsonPath = "/certs/certs.json" }) {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState([]);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    fetch(jsonPath)
      .then((res) => res.json())
      .then((data) => {
        setItems(data || []);
        setOrder(data.map((_, i) => i));
      })
      .catch((err) => console.error("Failed to load certs:", err));
  }, [jsonPath]);

  const cycleNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setAnimating(false);
    }, 800);
  };

  const cyclePrev = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
      setAnimating(false);
    }, 800);
  };

  // keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") cycleNext();
      if (e.key === "ArrowLeft") cyclePrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (items.length === 0) {
    return <div className="text-slate-400">No certificates found.</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold">Certificates</h2>

      <div className="relative w-[32rem] h-[22rem]">
        <AnimatePresence mode="popLayout">
          {order.map((idx, i) => {
            const isTop = i === 0;
            const cert = items[idx];

            return (
              <motion.div
                key={idx}
                className="absolute w-full h-full rounded-2xl border border-slate-700 shadow-2xl overflow-hidden cursor-pointer"
                style={{ zIndex: items.length - i }}
                onClick={() => cert.file && window.open(cert.file, "_blank")}
                initial={isTop ? { scale: 1, y: 0, opacity: 1 } : { scale: 0.95, y: 20, opacity: 0.7 }}
                animate={
                  isTop
                    ? animating
                      ? { scale: 1.2, y: -120, opacity: 0 }
                      : {
                          scale: [1, 1.05, 1], // floating pulse
                          y: [0, -8, 0],       // float loop
                          opacity: 1,
                          boxShadow: [
                            "0 0 25px rgba(255,0,150,0.5)",
                            "0 0 35px rgba(0,200,255,0.5)",
                            "0 0 25px rgba(255,0,150,0.5)",
                          ],
                        }
                    : { scale: 0.95, y: 20, opacity: 0.7 }
                }
                exit={isTop ? { scale: 1.2, y: -120, opacity: 0 } : {}}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  boxShadow: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                {/* Certificate image – only render if valid */}
                {cert.file && (
                  <img
                    src={cert.file}
                    alt={cert.title || "Certificate"}
                    className="w-full h-full object-contain"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}

                {/* Idle shimmer sweep */}
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
                  }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex gap-6 mt-4">
        <button
          onClick={cyclePrev}
          className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
          disabled={animating}
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={cycleNext}
          className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
          disabled={animating}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
