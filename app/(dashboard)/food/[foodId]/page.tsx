"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Food = {
  foodId: string;
  title: string;
  description: string | null;
  quantity: number;
  city: string;
  imageUrl: string | null;
  expiredAt: string;
  status: string;
  createdAt: string;
};

export default function FoodDetailPage() {
  const [showImage, setShowImage] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [note, setNote] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");

  const params = useParams();
  const foodId = params.foodId as string;

  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch(`/api/foods/${foodId}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch food.");
        }

        setFood(data);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (foodId) {
      fetchFood();
    }
  }, [foodId]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  const handleClaim = async () => {
    try {
      setClaimLoading(true);
      setClaimMessage("");

      const response = await fetch(`/api/foods/${foodId}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note: note.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setClaimMessage(data.message || "Failed to submit claim.");
        return;
      }

      setClaimMessage("Claim request submitted successfully!");
      setShowClaimForm(false);
      setNote("");
    } catch (error) {
      console.error(error);
      setClaimMessage("Something went wrong.");
    } finally {
      setClaimLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 pb-16 pt-32 md:px-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center">
          <p className="text-gray-500">Loading food details...</p>
        </div>
      </main>
    );
  }

  if (error || !food) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 pb-16 pt-32 md:px-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Food not found</h1>

          <p className="mt-2 text-gray-500">
            {error || "This food donation does not exist."}
          </p>

          <Link
            href="/home"
            className="mt-6 inline-block rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Back to Discovery
          </Link>
        </div>
      </main>
    );
  }

  const isAvailable =
    food.status === "AVAILABLE" && new Date(food.expiredAt) > new Date();

  return (
    <main className="min-h-screen bg-gray-50 px-6 pb-16 pt-32 md:px-24">
      <div className="mx-auto max-w-5xl">
        {/* BACK */}
        <Link
          href="/home"
          className="mb-6 inline-block text-sm font-medium text-gray-600 transition hover:text-black"
        >
          ← Back to Discovery
        </Link>

        {/* DETAIL CARD */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm md:grid md:grid-cols-2">
          {/* IMAGE */}
          {/* IMAGE */}
          <div
            className="aspect-square w-full cursor-pointer overflow-hidden bg-gray-200"
            onClick={() => food.imageUrl && setShowImage(true)}
          >
            {food.imageUrl ? (
              <img
                src={food.imageUrl}
                alt={food.title}
                className="h-full w-full object-cover transition duration-300 hover:brightness-90"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-7 md:p-10">
            {/* STATUS */}
            <div className="mb-5">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isAvailable ? "Available" : "Expired"}
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              {food.title}
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-4 leading-relaxed text-gray-500">
              {food.description || "No description provided."}
            </p>

            {/* INFO */}
            <div className="mt-8 space-y-5">
              <div>
                <p className="text-sm text-gray-400">Quantity</p>

                <p className="mt-1 font-medium text-gray-900">
                  {food.quantity} portions
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Location</p>

                <p className="mt-1 font-medium text-gray-900">📍 {food.city}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Expiration</p>

                <p className="mt-1 font-medium text-gray-900">
                  {formatDate(food.expiredAt)}
                </p>
              </div>
            </div>

            {/* ACTION */}
            <div className="mt-10">
              {isAvailable ? (
                <>
                  {!showClaimForm ? (
                    <button
                      type="button"
                      onClick={() => {
                        setShowClaimForm(true);
                        setClaimMessage("");
                      }}
                      className="w-full rounded-xl bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800"
                    >
                      Claim Food
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="claim-note"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Note for the donor
                        </label>

                        <textarea
                          id="claim-note"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={4}
                          maxLength={500}
                          placeholder="Tell the donor why you would like to claim this food..."
                          className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black"
                        />

                        <p className="mt-1 text-right text-xs text-gray-400">
                          {note.length}/500
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleClaim}
                        disabled={claimLoading}
                        className="w-full rounded-xl bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {claimLoading ? "Submitting..." : "Submit Claim"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowClaimForm(false);
                          setNote("");
                        }}
                        disabled={claimLoading}
                        className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3.5 font-medium text-gray-700 transition hover:border-black"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {claimMessage && (
                    <p className="mt-3 text-center text-sm text-gray-600">
                      {claimMessage}
                    </p>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-gray-200 px-5 py-3.5 font-semibold text-gray-500"
                >
                  Food Expired
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showImage && food.imageUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6"
          onClick={() => setShowImage(false)}
        >
          <div className="relative max-h-[90vh] max-w-5xl">
            <img
              src={food.imageUrl}
              alt={food.title}
              className="max-h-[90vh] max-w-full rounded-2xl object-contain"
            />

            <button
              type="button"
              onClick={() => setShowImage(false)}
              className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-2 text-xl text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
