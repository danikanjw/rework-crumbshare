"use client";

import { authClient } from "@/lib/auth-client";

export default function TestAuthPage() {
  const handleRegister = async () => {
    console.log("BUTTON CLICKED");

    const { data, error } = await authClient.signUp.email({
      email: "test@yayaya.com",
      password: "password456",
      name: "Test User2",
      username: "testuser2",
      phone: "0812345678902",
    });

    console.log("DATA:", data);
    console.log("ERROR:", JSON.stringify(error, null, 2));
  };

  const handleLogin = async () => {
    console.log("LOGIN CLICKED");

    const { data, error } = await authClient.signIn.email({
      email: "test@yayaya.com",
      password: "password456",
    });

    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);
  };

  const handleSession = async () => {
    const { data, error } = await authClient.getSession();

    console.log("SESSION:", data);
    console.log("SESSION ERROR:", error);
  };

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    console.log("LOGOUT ERROR:", error);
  };

  return (
    <main className="min-h-screen p-20">
      <h1 className="mb-6 text-2xl font-bold">Better Auth Test</h1>

      <button
        type="button"
        onClick={handleRegister}
        className="cursor-pointer rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
      >
        Test Register
      </button>

      <button
        onClick={handleLogin}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Test Login
      </button>

      <button
        onClick={handleSession}
        className="rounded bg-green-600 px-4 py-2 text-white"
      >
        Check Session
      </button>
      <button
        onClick={handleLogout}
        className="rounded bg-red-600 px-4 py-2 text-white"
      >
        Logout
      </button>
    </main>
  );
}
