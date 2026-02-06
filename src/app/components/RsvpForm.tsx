"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Session = "Public" | "Private";

function isValidPhone(phone: string) {
  const cleaned = phone.replace(/\s|-/g, "");
  return /^(?:\+?6?01)[0-9]{8,9}$/.test(cleaned);
}

type Props = {
  session: Session;
};

export default function RsvpForm({ session }: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Total guests (your buttons)
  const [guests, setGuests] = useState(1);

  const [status, setStatus] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Adults + Kids must sum to guests
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);

  // Keep adults/kids always valid whenever total changes
  useEffect(() => {
    // Clamp adults to [0..guests]
    if (adults > guests) setAdults(guests);

    // After clamping adults, enforce kids = guests - adults if needed
    const desiredKids = guests - Math.min(adults, guests);

    // If kids is out of range or sum doesn't match, fix it
    if (kids !== desiredKids) setKids(desiredKids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guests]);

  // Adults options depend on total guests
  const adultOptions = useMemo(
    () => Array.from({ length: guests + 1 }, (_, i) => i), // 0..guests
    [guests]
  );

  // Kids options depend on adults (so kids <= guests - adults)
  const kidsOptions = useMemo(
    () => Array.from({ length: guests - adults + 1 }, (_, i) => i), // 0..(guests-adults)
    [guests, adults]
  );

  function handleAdultsChange(nextAdults: number) {
    setAdults(nextAdults);
    setKids(guests - nextAdults); // force sum exact
  }

  function handleKidsChange(nextKids: number) {
    setKids(nextKids);
    setAdults(guests - nextKids); // force sum exact
  }

  function handleGuestsClick(n: number) {
    setGuests(n);

    // Keep current adults if possible, otherwise clamp
    const newAdults = Math.min(adults, n);
    setAdults(newAdults);
    setKids(n - newAdults);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    setPhoneError("");

    const cleanedPhone = phone.replace(/\s|-/g, "");

    if (!isValidPhone(cleanedPhone)) {
      setPhoneError("Please enter a valid Malaysian phone number (e.g. 0123456789)");
      return;
    }

    setStatus("Submitting...");

    const { error } = await supabase.from("rsvps").insert({
      full_name: fullName.trim(),
      phone: cleanedPhone,
      guests,  // total
      adults,  // split
      kids,    // split
      session,
    });

    if (error) {
      setStatus("❌ Something went wrong. Please try again.");
      return;
    }

    setStatus("✅ RSVP submitted. Thank you!");
    setFullName("");
    setPhone("");
    setGuests(1);
    setAdults(1);
    setKids(0);
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-5">
      <div>
        <label className="text-sm text-zinc-600">Full Name</label>
        <input
          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white p-3.5 outline-none focus:border-zinc-400"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm text-zinc-600">Phone Number</label>
        <input
          className={[
            "mt-2 w-full rounded-2xl border bg-white p-3.5 outline-none",
            phoneError
              ? "border-red-400 focus:border-red-500"
              : "border-zinc-200 focus:border-zinc-400",
          ].join(" ")}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setPhoneError("");
          }}
          placeholder="e.g. 0123456789"
          required
        />

        {phoneError && <p className="mt-2 text-sm text-red-600">{phoneError}</p>}
      </div>
      <div>
        <label className="text-sm text-zinc-600">Number of Guests</label>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleGuestsClick(n)}
              className={[
                "rounded-2xl border px-4 py-3 text-sm transition",
                guests === n
                  ? "border-black bg-black text-white"
                  : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50",
              ].join(" ")}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Adults */}
        <div>
          <label className="block text-sm mb-1">Adults</label>
          <select
            className="w-full rounded-lg border px-3 py-2 bg-white"
            value={adults}
            onChange={(e) => handleAdultsChange(Number(e.target.value))}
            required
          >
            {adultOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Kids */}
        <div>
          <label className="block text-sm mb-1">Kids</label>
          <select
            className="w-full rounded-lg border px-3 py-2 bg-white"
            value={kids}
            onChange={(e) => handleKidsChange(Number(e.target.value))}
          >
            {kidsOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-zinc-600">
        Total {guests} = Adults {adults} + Kids {kids}
      </p>

      <button
        type="submit"
        className="w-full rounded-2xl bg-black p-3.5 text-white hover:opacity-90"
      >
        Submit RSVP
      </button>

      {status && (
        <div className="rounded-2xl border border-zinc-200 bg-[#fbf7f3] p-4 text-sm text-zinc-700">
          {status}
        </div>
      )}
    </form>
  );
}
