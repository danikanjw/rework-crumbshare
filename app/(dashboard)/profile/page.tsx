"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Profile = {
  id: string;
  name: string | null;
  username: string;
  email: string;
  phone: string;
  image: string | null;
};

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/profile");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile.");
        }

        setProfile(data);
        setName(data.name || "");
        setUsername(data.username);
        setPhone(data.phone);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      setProfile(data);

      setName(data.name || "");
      setUsername(data.username);
      setPhone(data.phone);

      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 pb-16 pt-32 md:px-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 pb-16 pt-32 md:px-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Something went wrong
          </h1>

          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 pb-16 pt-32 md:px-24">
      <div className="mx-auto max-w-3xl">
        {/* HEADER */}
        <section className="mb-10">
          <p className="text-sm font-medium text-gray-500">
            Your account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-5xl">
            Profile
          </h1>

          <p className="mt-3 max-w-2xl text-gray-500">
            Manage your personal information and contact details.
          </p>
        </section>

        {/* PROFILE CARD */}
        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          {/* AVATAR */}
          <div className="flex items-center gap-5 border-b border-gray-100 pb-6">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-2xl font-semibold text-gray-500">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={profile.name || profile.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                (profile?.name?.charAt(0) ||
                  profile?.username.charAt(0) ||
                  "?").toUpperCase()
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile?.name || profile?.username}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                @{profile?.username}
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSave} className="mt-8 space-y-6">
            {/* NAME */}
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={100}
                required
                className="mt-2 text-black w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
              />
            </div>

            {/* USERNAME */}
            <div>
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                maxLength={25}
                required
                className="mt-2 text-black w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
              />

              <p className="mt-1 text-xs text-gray-400">
                Letters, numbers, and underscores only.
              </p>
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={profile?.email || ""}
                disabled
                className="mt-2 text-black w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
              />

              <p className="mt-1 text-xs text-gray-400">
                Email cannot be changed here.
              </p>
            </div>

            {/* PHONE */}
            <div>
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                maxLength={20}
                required
                inputMode="tel"
                className="mt-2 w-full text-black rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
              />

              <p className="mt-1 text-xs text-gray-400">
                This number will be shared with the other party
                after a claim is accepted.
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
                {success}
              </div>
            )}

            {/* SAVE */}
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        {/* ACCOUNT */}
        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-lg font-semibold text-gray-900">
            Account
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your CrumbShare account.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Log Out
          </button>
        </section>

        {/* BACK */}
        <Link
          href="/home"
          className="mt-6 inline-block text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-black"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}