"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("home");

    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      {
        threshold: 0,
      }
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`fixed left-0 top-0 z-50 w-full px-8 py-6 md:px-24 transition-all duration-300 ${
      scrolled
        ? "bg-white shadown-md"
        : "bg-transparent"
   }`}>
      <div className="flex items-center justify-between">

        {/* Brand */}
        <div className="md:text-4xl text-2xl font-bold text-black">
          CrumbShare
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:mx-5 items-center gap-8 md:flex text-2xl text-black">
          <a href="#home" className="hover:text-gray-300">Home</a>
          <a href="#about" className="hover:text-gray-300">About</a>
          <a href="#action" className="hover:text-gray-300">Action</a>
          <a href="#contact" className="hover:text-gray-300">Contact</a>
          <a href="#login" className="hover:text-gray-300">Login</a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mt-4 flex flex-col gap-4 md:hidden">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#action">Action</a>
          <a href="#contact">Contact</a>
          <a href="#login">Login</a>
        </div>
      )}
    </nav>
  );
}