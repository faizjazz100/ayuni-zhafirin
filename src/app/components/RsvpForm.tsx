"use client";

import { useState } from "react";
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
  const [guests, setGuests] = useState(1);
  const [status, setStatus] = useState("");
  const [phoneError, setPhoneError] = useState("");


  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    setPhoneError("");

    const cleanedPhone = phone.replace(/\s|-/g, "");

    if (!isValidPhone(cleanedPhone)) {
      setPhoneError(
        "Please enter a valid Malaysian phone number (e.g. 0123456789)"
      );
      return;
    }

    setStatus("Submitting...");

    const { error } = await supabase.from("rsvps").insert({
      full_name: fullName.trim(),
      phone: cleanedPhone,
      guests,
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
  }


  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
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

        {phoneError && (
          <p className="mt-2 text-sm text-red-600">{phoneError}</p>
        )}
      </div>
      <div>
        <label className="text-sm text-zinc-600">Number of Guests</label>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setGuests(n)}
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
