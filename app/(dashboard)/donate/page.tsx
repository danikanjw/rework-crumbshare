"use client";

import { useRef, useState } from "react";

export default function DonatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [city, setCity] = useState("");
  const [expiredAt, setExpiredAt] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const getMinDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60000);

  return localDate.toISOString().slice(0, 16);
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Validasi waktu expired
    const expirationDate = new Date(expiredAt);

if (expirationDate <= new Date()) {
  alert("Expiration date must be in the future.");
  return;
}

    // Validasi quantity
    const quantityNumber = Number(quantity);

    if (!Number.isInteger(quantityNumber) || quantityNumber < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    if (!image) {
      alert("Please choose an image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("quantity", quantityNumber.toString());
      formData.append("city", city);
      formData.append("expiredAt", expiredAt);
      formData.append("image", image);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert(data.message || "Failed to donate food.");
        return;
      }

      console.log("SUCCESS:", data);
      alert("Food successfully donated!");

      // Reset form
      setTitle("");
      setDescription("");
      setQuantity("");
      setCity("");
      setExpiredAt("");
      setImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Reset file input
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 pb-16 pt-32 md:px-24">
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-500">Share your food</p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-5xl">
            Donate Food
          </h1>

          <p className="mt-3 max-w-2xl text-gray-500">
            Have extra food? Share it with someone in your community instead of
            letting it go to waste.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* FOOD NAME */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Food Name
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Nasi Ayam"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Describe the food, condition, ingredients, etc."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black"
              />
            </div>

            {/* QUANTITY + CITY */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Quantity
                </label>

                <input
                  id="quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Izinkan kosong saat user menghapus input
                    if (value === "") {
                      setQuantity("");
                      return;
                    }

                    const number = Number(value);

                    if (/^\d+$/.test(value) && Number(value) >= 1) {
                      setQuantity(value);
                    }
                  }}
                  required
                  placeholder="e.g. 10"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  City
                </label>

                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="e.g. Sidoarjo"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black"
                />
              </div>
            </div>

            {/* IMAGE */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Food Photo
              </label>

              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
              />

              <p className="mt-2 text-xs text-gray-400">
                Upload a clear photo of the food.
              </p>
            </div>

            {/* EXPIRATION */}
            <div>
              <label
                htmlFor="expiredAt"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Expiration Date & Time
              </label>

              <input
                id="expiredAt"
                type="datetime-local"
                value={expiredAt}
                min={getMinDateTime()}
                onChange={(e) => setExpiredAt(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-black"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Donating..." : "Donate Food"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
