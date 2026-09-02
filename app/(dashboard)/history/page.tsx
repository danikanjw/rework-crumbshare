"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Claim = {
  claimId: string;
  status: string;
  note: string | null;
  createdAt: string;
  food: {
    foodId: string;
    title: string;
    city: string;
    imageUrl: string | null;
    quantity: number;
    expiredAt: string;
    status: string;
    donor: {
      name: string | null;
      phone: string | null;
    };
  };
};

type DonationClaim = {
  claimId: string;
  status: string;
  note: string | null;
  createdAt: string;
  recipient: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
};

type Donation = {
  foodId: string;
  title: string;
  description: string | null;
  quantity: number;
  city: string;
  imageUrl: string | null;
  expiredAt: string;
  status: string;
  createdAt: string;
  claims: DonationClaim[];
};

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"claims" | "donations">("claims");

  const [claims, setClaims] = useState<Claim[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingClaimId, setProcessingClaimId] = useState<string | null>(
    null,
  );

  const [selectedContact, setSelectedContact] = useState<{
    name: string;
    phone: string | null;
    role: "Donor" | "Recipient";
  } | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const [claimsResponse, donationsResponse] = await Promise.all([
        fetch("/api/claims"),
        fetch("/api/donations"),
      ]);

      const claimsData = await claimsResponse.json();
      const donationsData = await donationsResponse.json();

      if (!claimsResponse.ok) {
        throw new Error(claimsData.message || "Failed to fetch your claims.");
      }

      if (!donationsResponse.ok) {
        throw new Error(
          donationsData.message || "Failed to fetch your donations.",
        );
      }

      setClaims(claimsData);
      setDonations(donationsData);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClaimAction = async (
    claimId: string,
    status: "ACCEPTED" | "REJECTED",
  ) => {
    try {
      setProcessingClaimId(claimId);
      setError("");

      const response = await fetch(`/api/claims/${claimId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update claim.");
      }

      // Refresh history supaya status terbaru langsung terlihat
      await fetchHistory();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setProcessingClaimId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "ACCEPTED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "CLAIMED":
        return "bg-blue-100 text-blue-700";

      case "EXPIRED":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 pb-16 pt-32 md:px-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center">
          <p className="text-gray-500">Loading history...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 pb-16 pt-32 md:px-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center">
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
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <section className="mb-10">
          <p className="text-sm font-medium text-gray-500">Your activity</p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-5xl">
            History
          </h1>

          <p className="mt-3 max-w-2xl text-gray-500">
            Keep track of the food you have claimed and the donations you have
            shared.
          </p>
        </section>

        {/* TABS */}
        <div className="mb-8 flex rounded-2xl bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("claims")}
            className={`flex-1 rounded-xl px-5 py-3 text-sm font-medium transition ${
              activeTab === "claims"
                ? "bg-black text-white"
                : "text-gray-500 hover:text-black"
            }`}
          >
            My Claims
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("donations")}
            className={`flex-1 rounded-xl px-5 py-3 text-sm font-medium transition ${
              activeTab === "donations"
                ? "bg-black text-white"
                : "text-gray-500 hover:text-black"
            }`}
          >
            My Donations
          </button>
        </div>

        {/* MY CLAIMS */}
        {activeTab === "claims" && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Claims</h2>

              <p className="text-sm text-gray-500">
                {claims.length} claim{claims.length !== 1 ? "s" : ""}
              </p>
            </div>

            {claims.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                <p className="font-medium text-gray-900">No claims yet</p>

                <p className="mt-1 text-sm text-gray-500">
                  Find some food to claim from the discovery page.
                </p>

                <Link
                  href="/home"
                  className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Discover Food
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {claims.map((claim) => (
                  <article
                    key={claim.claimId}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* IMAGE */}
                      <div className="aspect-video w-full bg-gray-200 md:aspect-square md:w-56">
                        {claim.food.imageUrl ? (
                          <img
                            src={claim.food.imageUrl}
                            alt={claim.food.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {claim.food.title}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              📍 {claim.food.city}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                              claim.status,
                            )}`}
                          >
                            {claim.status}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-xs text-gray-400">Quantity</p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {claim.food.quantity} portions
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400">Requested</p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {formatDate(claim.createdAt)}
                            </p>
                          </div>
                        </div>

                        {claim.note && (
                          <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                            <p className="text-xs font-medium text-gray-400">
                              Your note
                            </p>

                            <p className="mt-1 text-sm leading-relaxed text-gray-600">
                              {claim.note}
                            </p>
                          </div>
                        )}

                        <Link
                          href={`/food/${claim.food.foodId}`}
                          className="mt-5 inline-block text-sm font-medium text-gray-900 underline underline-offset-4"
                        >
                          View Food
                        </Link>

                        {claim.status === "ACCEPTED" && (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedContact({
                                name: claim.food.donor.name || "Donor",
                                phone: claim.food.donor.phone,
                                role: "Donor",
                              })
                            }
                            className="mt-4 block text-sm font-medium text-gray-900 underline underline-offset-4"
                          >
                            View Donor Contact
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* MY DONATIONS */}
        {activeTab === "donations" && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Donations</h2>

              <p className="text-sm text-gray-500">
                {donations.length} donation
                {donations.length !== 1 ? "s" : ""}
              </p>
            </div>

            {donations.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                <p className="font-medium text-gray-900">No donations yet</p>

                <p className="mt-1 text-sm text-gray-500">
                  Share your extra food with your community.
                </p>

                <Link
                  href="/donate"
                  className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Donate Food
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {donations.map((donation) => {
                  const pendingClaims = donation.claims.filter(
                    (claim) => claim.status === "PENDING",
                  );

                  return (
                    <article
                      key={donation.foodId}
                      className="overflow-hidden rounded-3xl bg-white shadow-sm"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* IMAGE */}
                        <div className="aspect-video w-full bg-gray-200 md:aspect-square md:w-56">
                          {donation.imageUrl ? (
                            <img
                              src={donation.imageUrl}
                              alt={donation.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                              No image
                            </div>
                          )}
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">
                                {donation.title}
                              </h3>

                              <p className="mt-1 text-sm text-gray-500">
                                📍 {donation.city}
                              </p>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                                donation.status,
                              )}`}
                            >
                              {donation.status}
                            </span>
                          </div>

                          <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div>
                              <p className="text-xs text-gray-400">Quantity</p>

                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {donation.quantity} portions
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">Expires</p>

                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {formatDate(donation.expiredAt)}
                              </p>
                            </div>
                          </div>

                          {/* CLAIM REQUESTS */}
                          <div className="mt-6 border-t border-gray-100 pt-5">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900">
                                Claim Requests
                              </h4>

                              <span className="text-sm text-gray-500">
                                {pendingClaims.length} pending
                              </span>
                            </div>

                            {donation.claims.length === 0 ? (
                              <p className="mt-3 text-sm text-gray-400">
                                No claim requests yet.
                              </p>
                            ) : (
                              <div className="mt-4 space-y-3">
                                {donation.claims.map((claim) => (
                                  <div
                                    key={claim.claimId}
                                    className="rounded-2xl bg-gray-50 p-4"
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div>
                                        <p className="font-medium text-gray-900">
                                          {claim.recipient.name ||
                                            claim.recipient.email}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                          Requested{" "}
                                          {formatDate(claim.createdAt)}
                                        </p>
                                      </div>

                                      <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                                          claim.status,
                                        )}`}
                                      >
                                        {claim.status}
                                      </span>
                                    </div>

                                    {claim.note && (
                                      <div className="mt-3 rounded-xl bg-white p-3">
                                        <p className="text-xs text-gray-400">
                                          Note
                                        </p>

                                        <p className="mt-1 text-sm text-gray-600">
                                          {claim.note}
                                        </p>
                                        {claim.status === "ACCEPTED" && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setSelectedContact({
                                                name:
                                                  claim.recipient.name ||
                                                  claim.recipient.email,
                                                phone: claim.recipient.phone,
                                                role: "Recipient",
                                              })
                                            }
                                            className="mt-4 text-sm font-medium text-gray-900 underline underline-offset-4"
                                          >
                                            View Recipient Contact
                                          </button>
                                        )}
                                      </div>
                                    )}

                                    {/* ACCEPT / REJECT */}
                                    {claim.status === "PENDING" && (
                                      <div className="mt-4 flex gap-3">
                                        <button
                                          type="button"
                                          disabled={
                                            processingClaimId === claim.claimId
                                          }
                                          onClick={() =>
                                            handleClaimAction(
                                              claim.claimId,
                                              "ACCEPTED",
                                            )
                                          }
                                          className="flex-1 rounded-xl bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                          {processingClaimId === claim.claimId
                                            ? "Processing..."
                                            : "Accept"}
                                        </button>

                                        <button
                                          type="button"
                                          disabled={
                                            processingClaimId === claim.claimId
                                          }
                                          onClick={() =>
                                            handleClaimAction(
                                              claim.claimId,
                                              "REJECTED",
                                            )
                                          }
                                          className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                          {processingClaimId === claim.claimId
                                            ? "Processing..."
                                            : "Reject"}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>

      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Contact</p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {selectedContact.role}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                className="text-2xl leading-none text-gray-400 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">Name</p>

              <p className="mt-1 font-medium text-gray-900">
                {selectedContact.name}
              </p>

              <p className="mt-4 text-xs text-gray-400">Phone</p>

              {selectedContact.phone ? (
                <a
                  href={`tel:${selectedContact.phone}`}
                  className="mt-1 block font-medium text-gray-900 underline underline-offset-4"
                >
                  {selectedContact.phone}
                </a>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  Phone number not provided.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedContact(null)}
              className="mt-5 w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
