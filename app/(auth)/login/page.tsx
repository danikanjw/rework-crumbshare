"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message ?? "Login failed");
      setLoading(false);
      return;
    }

    console.log("LOGIN DATA:", data);

    setLoading(false);
    router.push("/home");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-bl from-[#8d8d8d] via-[#d2d2d2] to-[#ffffff] px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        {/* LEFT - IMAGE / BRANDING */}
        <div className="relative hidden min-h-[650px] bg-gray-200 md:block">
          <div className="absolute inset-0 z-10 flex items-center justify-center">
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

        {/* RIGHT - LOGIN FORM */}
        <div className="flex min-h-[650px] flex-col justify-center p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>

            <p className="mt-2 text-sm text-gray-500">
              Login to continue sharing food with your community.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
                className="w-full rounded-lg text-black border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black"
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
                className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black"
                placeholder="Your password"
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* REGISTER LINK */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-black underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
