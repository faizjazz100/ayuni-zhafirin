"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Session = "Public" | "Private";

function normalizePhone(phone: string) {
  return phone.replace(/\s|-/g, "");
}

function isValidPhone(phone: string) {
  // Accept: 01xxxxxxxx or +601xxxxxxxx
  return /^(?:\+?6?01)[0-9]{8,9}$/.test(phone);
}

type Props = {
  session: Session;
};

export default function RsvpForm({ session }: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [guests, setGuests] = useState(1);
  const [adults, setAdults] = useState(1);
  const kids = useMemo(() => Math.max(0, guests - adults), [guests, adults]);

  const [message, setMessage] = useState("");

  const [status, setStatus] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const adultOptions = useMemo(
    () => Array.from({ length: guests + 1 }, (_, i) => i),
    [guests]
  );

  function handleGuestsClick(n: number) {
    setGuests(n);
    // clamp adults to [0..n]
    setAdults((prev) => Math.min(prev, n));
  }

  function handleAdultsChange(nextAdults: number) {
    // clamp adults to [0..guests]
    const clamped = Math.max(0, Math.min(nextAdults, guests));
    setAdults(clamped);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    setPhoneError("");

    const name = fullName.trim();
    const cleanedPhone = normalizePhone(phone);

    if (!name) {
      setStatus("Please enter your full name.");
      return;
    }

    if (!isValidPhone(cleanedPhone)) {
      setPhoneError("Please enter a valid Malaysian phone number, example 0123456789.");
      return;
    }

    const trimmedMessage = message.trim();
    const safeMessage = trimmedMessage.length > 0 ? trimmedMessage.slice(0, 400) : null;

    setSubmitting(true);
    setStatus("Submitting...");

    const { error } = await supabase.from("rsvps").insert({
      full_name: name,
      phone: cleanedPhone,
      guests,
      adults,
      kids,
      session,
      message: safeMessage,
      show_message: false,
    });


    setSubmitting(false);

    if (error) {
      setStatus(`❌ Something went wrong. ${error.message}`);
      return;
    }

    setStatus("✅ RSVP submitted. Thank you!");
    setFullName("");
    setPhone("");
    setGuests(1);
    setAdults(1);
    setMessage("");
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
          {guestOptions.map((n) => (
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
        <div>
          <label className="block text-sm mb-1 text-zinc-600">Adults</label>
          <select
            className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm"
            value={adults}
            onChange={(e) => handleAdultsChange(Number(e.target.value))}
          >
            {adultOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1 text-zinc-600">Kids</label>
          <input
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-700"
            value={kids}
            readOnly
          />
        </div>
      </div>

      <p className="text-sm text-zinc-600">
        Total {guests} = Adults {adults} + Kids {kids}
      </p>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Message or wish (optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          maxLength={400}
          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
          placeholder="Write a short wish..."
        />
        <p className="mt-1 text-xs text-zinc-500">{message.length}/400</p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={[
          "w-full rounded-2xl p-3.5 text-white",
          submitting ? "bg-black/70" : "bg-black hover:opacity-90",
        ].join(" ")}
      >
        {submitting ? "Submitting..." : "Submit RSVP"}
      </button>

      {status && (
        <div className="rounded-2xl border border-zinc-200 bg-[#fbf7f3] p-4 text-sm text-zinc-700">
          {status}
        </div>
      )}
    </form>
  );
}
