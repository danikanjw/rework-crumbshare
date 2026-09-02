"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Food = {
  foodId: string;
  title: string;
  description: string | null;
  quantity: number;
  city: string;
  imageUrl: string | null;
  expiredAt: string;
};

export default function DiscoveryPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch("/api/foods");

        if (!response.ok) {
          throw new Error("Failed to fetch foods");
        }

        const data = await response.json();

        setFoods(data);
      } catch (error) {
        console.error("FETCH FOODS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const filteredFoods = foods.filter((food) =>
    food.title.toLowerCase().includes(search.toLowerCase()),
  );

  const formatExpiration = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 pb-16 pt-32 md:px-24">
      {/* HEADER */}
      <section className="mb-10">
        <p className="text-sm font-medium text-gray-500">
          Discover food near you
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-5xl">
          Find food, share kindness.
        </h1>

        <p className="mt-3 max-w-2xl text-gray-500">
          Discover available food donations from people and organizations around
          your community.
        </p>
      </section>

      {/* SEARCH */}
      <section className="mb-10">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search food..."
          className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black"
        />
      </section>

      {/* FOOD LIST */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Available Food</h2>

          {!loading && (
            <p className="text-sm text-gray-500">
              {filteredFoods.length} available
            </p>
          )}
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <p className="text-gray-500">Loading food...</p>
          </div>
        ) : filteredFoods.length === 0 ? (
          /* EMPTY */
          <div className="rounded-2xl bg-white p-10 text-center">
            <p className="font-medium text-gray-900">No food found</p>

            <p className="mt-1 text-sm text-gray-500">Try another search.</p>
          </div>
        ) : (
          /* FOOD CARDS */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFoods.map((food) => (
              <article
                key={food.foodId}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* IMAGE */}
                <div className="h-48 bg-gray-200">
                  {food.imageUrl ? (
                    <img
                      src={food.imageUrl}
                      alt={food.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{food.title}</h3>

                  {food.description && (
                    <p className="mt-2 min-h-[40px] line-clamp-2 text-sm text-gray-500">
                      {food.description}
                    </p>
                  )}

                  <p className="mt-4 text-sm text-gray-500">
                    {food.quantity} portions available
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-gray-500">
                    <p>📍 {food.city}</p>

                    <p>⏰ Expires {formatExpiration(food.expiredAt)}</p>
                  </div>

                  <Link
                    href={`/food/${food.foodId}`}
                    className="mt-5 block w-full rounded-xl bg-black py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
