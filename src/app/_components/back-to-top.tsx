"use client";

import { useState, useEffect } from "react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    setIsVisible(window.scrollY > 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="z-90 fixed bottom-8 right-8"
      style={{ display: isVisible ? "block" : "none" }}
    >
      <button
        className="h-16 w-16 rounded-full border-0 bg-indigo-500 text-3xl font-bold text-white drop-shadow-md"
        onClick={handleClick}
      >
        &uarr;
      </button>
    </div>
  );
}
