"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWaze } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";


export default function HomePage() {
  // ✅ EDIT THESE (kept consistent)
  const DATE_TOP = "April 18, 2026";
  const HASHTAG = "#YUNIZHAF";
  const COUPLE = "Ayuni & Zhafirin";
  const SUBLINE = "18.4.2026 | Luminare Hall, Petaling Jaya";
  const RSVP_DEADLINE = "28 March 2026";

  // ✅ Contact
  const CONTACTS = [
    { name: "Darwish (Bride’s)", phone: "012-846 2690" },
    { name: "Tasha (Bride’s)", phone: "011-635 54265" },
    { name: "Mai (Groom’s)", phone: "013-355 2455" },
    { name: "Elin (Groom’s)", phone: "019-226 6996" }
  ];

  // ✅ Convert Malaysia phone (019xxxxxxx) -> 6019xxxxxxx for wa.me
  const toMYWa = (phone: string) => {
    const digits = phone.replace(/\D/g, ""); // 0192112455
    if (digits.startsWith("60")) return digits; // already 60xxxxxxxxxx
    if (digits.startsWith("0")) return "6" + digits; // 0xxxxxxxxx -> 60xxxxxxxxx
    return digits; // fallback
  };

  return (
    <main className="min-h-screen text-zinc-800">
      {/* soft glow background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 -top-28 h-96 w-96 rounded-full bg-black/5 blur-3xl" />
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
      </div>
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-6 sm:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm"
        >
          <div className="grid lg:grid-cols-2">
            {/* Image */}
            <div className="relative h-[280px] sm:h-[360px] lg:h-[520px]">
              <Image
                src="/hero.jpeg"
                alt="Wedding"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

              <div className="absolute left-4 top-4 rounded-2xl font-bold border border-white/30 bg-white/70 px-4 py-2 tracking-[0.25em] text-zinc-700 backdrop-blur sm:left-6 sm:top-6">
                {DATE_TOP}
              </div>

              {/*
              <div className="absolute bottom-4 left-4 right-4 rounded-3xl border border-white/25 bg-white/70 p-4 backdrop-blur sm:bottom-6 sm:left-6 sm:right-6">
                <div className="text-xs uppercase tracking-[0.22em] text-zinc-600">
                  The Solemnization Of
                </div>
                <div className="mt-1 text-lg font-semibold text-zinc-900">
                  {COUPLE}
                </div>
              </div>
                          */}
            </div>
            {/* Text */}
            <div className="p-6 sm:p-10">
              <p className="uppercase tracking-[0.28em] font-bold text-zinc-800">
                {DATE_TOP}
              </p>

              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                {HASHTAG}
              </h1>

              <div className="mt-7">
                <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                  You’re invited to attend the solemnization ceremony between
                </p>
                <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                  {COUPLE}
                </h2>
                <p className="mt-4 text-sm text-zinc-600">{SUBLINE}</p>
              </div>

              {/* RSVP (public only) */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/rsvp"
                  className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm text-white hover:opacity-90"
                >
                  RSVP
                </Link>
                <span className="text-sm flex flex-col text-zinc-500">
                  RSVP by{" "}
                  <span className="font-medium text-zinc-700">
                    {RSVP_DEADLINE}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-6 sm:pb-10">
        <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
            Our Story
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold">
            How it all started
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-zinc-700">
            {/* Put your short preview here */}
            They met two years ago on the same working pathway, where their daily
            routines crossed without much thought. Both were focused on their
            careers, exchanging nothing more than brief greetings and occasional
            smiles, friendly acquaintances in a busy world..
            <Link
              href="/our-story"
              className="items-center justify-center px-1 font-bold hover:opacity-90"
            >
              View more
            </Link>
          </p>
        </div>
      </section>

      {/* DETAILS (keep as preview) */}
      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-6 sm:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Details
              </p>
              <h3 className="mt-2 font-serif text-3xl font-semibold">
                Schedule Preview
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                Full schedule is on the Schedule page.
              </p>
            </div>

            <Link
              href="/schedule"
              className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm text-white hover:opacity-90"
            >
              Open Full Schedule
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoCard time="8:00 AM" title="Family Arrival" />
            <InfoCard time="8:15 AM" title="Solemnisation Ceremony" />
            <InfoCard time="10:00 AM" title="Arrival of guests" />
            <InfoCard time="12:30 PM" title="End of Ceremony" />
          </div>
        </motion.div>
      </section>

      <section id="venue" className="mx-auto max-w-6xl px-5 pb-8 sm:px-6 sm:pb-10">
        <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
            Venue
          </p>

          <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
            Luminare Hall, Petaling Jaya
          </h2>

          <div className="mt-4 space-y-2 text-[15px] leading-7 text-zinc-700">
            <p>
              B-G-02, PJ TRADE CENTRE, 8, Jalan PJU 8/8A, Damansara Perdana, 47820 Petaling Jaya, Selangor
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://maps.app.goo.gl/dsUEjfK1u7NhSY386"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-5 py-3 text-sm text-zinc-800 hover:bg-zinc-50"
            >

              Open in Google Maps
              <FontAwesomeIcon icon={faGoogle} className="px-1 h-5 w-5" />
            </a>

            <a
              href="https://waze.com/ul/hw2860281s&navigate=yes"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm text-white hover:opacity-90"
              style={{ backgroundColor: "#0099FF" }} >
              Open in Waze App
              <FontAwesomeIcon icon={faWaze} className="px-1 h-7 w-7 text-black" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT (simple preview + link to full page) */}
      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-6 sm:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="font-serif text-3xl font-semibold">Contact</h3>
              <p className="mt-2 text-sm text-zinc-600">
                If you have any questions, feel free to contact us.
              </p>
            </div>
            <Link
              href="/contact"
              className="hidden rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm hover:bg-zinc-50 sm:inline-flex"
            >
              Open Contact Page
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {CONTACTS.map((c) => (
              <div
                key={c.name}
                className="rounded-3xl border border-zinc-200 bg-[#fbf7f3] p-6"
              >
                <p className="text-sm text-zinc-600">{c.name}</p>
                <p className="mt-1 text-lg font-semibold">{c.phone}</p>

                <div className="mt-4 flex gap-3">
                  <a
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-black px-4 py-2 text-sm text-white hover:opacity-90"
                    href={`tel:${c.phone.replace(/\D/g, "")}`}
                  >
                    Call
                  </a>
                  <a
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm hover:bg-zinc-50"
                    href={`https://wa.me/${toMYWa(c.phone)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-zinc-500">
            Thank you & see you there!
          </div>

          <div className="mt-6 sm:hidden">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm hover:bg-zinc-50"
            >
              Open Contact Page
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 pb-10 text-center text-sm text-zinc-500 sm:px-6">
        © {new Date().getFullYear()} {COUPLE}
      </footer>

      <style jsx global>{`
        .font-serif {
          font-family: var(--font-serif), ui-serif, Georgia, serif;
        }
      `}</style>
    </main>
  );
}

function InfoCard({ time, title }: { time: string; title: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-3xl border border-zinc-200 bg-[#fbf7f3] px-5 py-4">
      <div className="text-base font-semibold text-zinc-900">{time}</div>
      <div className="text-sm text-zinc-700 text-right">{title}</div>
    </div>
  );
}
