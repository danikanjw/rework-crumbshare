"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const hero = document.getElementById("home");

    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      {
        threshold: 0,
      },
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full px-8 py-6 transition-all duration-300 md:px-24 ${
        session || scrolled ? "bg-gray-50" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Brand */}

        {!session ? (
          <>
            <Link
              href="#home"
              className="text-2xl font-bold text-black md:text-4xl"
            >
              CrumbShare
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/home"
              className="text-2xl font-bold text-black md:text-4xl"
            >
              CrumbShare
            </Link>
          </>
        )}

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 text-2xl text-black md:flex">
          {!session ? (
            <>
              <a href="#home" className="transition hover:text-gray-500">
                Home
              </a>

              <a href="#about" className="transition hover:text-gray-500">
                About
              </a>

              <a href="#action" className="transition hover:text-gray-500">
                Action
              </a>

              <a href="#contact" className="transition hover:text-gray-500">
                Contact
              </a>

              <Link href="/login" className="transition hover:text-gray-500">
                Login
              </Link>
            </>
          ) : (
            <>
              <Link href="/home" className="transition hover:text-gray-500">
                Home
              </Link>

              <Link href="/donate" className="transition hover:text-gray-500">
                Donate
              </Link>

              <Link href="/history" className="transition hover:text-gray-500">
                History
              </Link>

              <Link href="/profile" className="transition hover:text-gray-500">
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="transition hover:text-gray-500"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="text-2xl md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}

      {isOpen && (
        <div className="mt-4 flex flex-col gap-4 text-black md:hidden">
          {!isPending &&
            (!session ? (
              <>
                <a
                  href="#home"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-gray-500"
                >
                  Home
                </a>

                <a
                  href="#about"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-gray-500"
                >
                  About
                </a>

                <a
                  href="#action"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-gray-500"
                >
                  Action
                </a>

                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-gray-500"
                >
                  Contact
                </a>

                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-gray-500"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-gray-500"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/home"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-gray-500"
                >
                  Home
                </Link>

                <Link
                  href="/donate"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-gray-500"
                >
                  Donate
                </Link>

                <Link
                  href="/history"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-gray-500"
                >
                  History
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-gray-500"
                >
                  Profile
                </Link>

                <button
                  onClick={async () => {
                    setIsOpen(false);
                    await handleLogout();
                  }}
                  className="text-left transition hover:text-gray-500"
                >
                  Logout
                </button>
              </>
            ))}
        </div>
      )}
    </nav>
  );
}
