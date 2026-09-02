"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  if (process.env.NODE_ENV === "production") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 bg-gradient-to-bl from-[#8d8d8d] via-[#d2d2d2] to-[#ffffff]">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
          <h1 className="text-3xl font-bold text-gray-900">
            Registration Unavailable
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            Registration is currently disabled for the demo version of
            CrumbShare.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Back to Login
          </Link>
        </div>
      </main>
    );
  }

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error } = await authClient.signUp.email({
      name,
      username,
      phone,
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error?.message ?? "Registration failed");
      return;
    }

    console.log("REGISTER SUCCESS:", data);

    window.location.href = "/";
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 bg-gradient-to-bl from-[#8d8d8d] via-[#d2d2d2] to-[#ffffff]">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        {/* LEFT - IMAGE / BRANDING */}
        <div className="relative hidden min-h-[650px] bg-gray-200 md:block">
          {/* Ganti bagian ini dengan Image component nanti */}
          <div className="absolute inset-0 flex z-10 items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white">CrumbShare</h2>

              <p className="mt-1 max-w-xs text-white">
                Share food, reduce waste, and help your community.
              </p>
            </div>
          </div>
          <Image
            src="/images/donationphoto.jpg"
            alt="Food donation"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>

        {/* RIGHT - REGISTER FORM */}
        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Create an account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Join CrumbShare and help reduce food waste.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* NAME */}
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black"
                placeholder="Your name"
              />
            </div>

            {/* USERNAME */}
            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black"
                placeholder="Username"
              />
            </div>

            {/* PHONE */}
            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Phone
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black"
                placeholder="you@example.com"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black"
                placeholder="At least 8 characters"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black"
                placeholder="Repeat your password"
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-black underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
