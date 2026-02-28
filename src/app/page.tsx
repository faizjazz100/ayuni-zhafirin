"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWaze, faGoogle } from "@fortawesome/free-brands-svg-icons";
import MessageCarouselSection from "./components/MessageCarouselSection";

import {
  Badge,
  SectionCard,
  SectionHeader,
  PrimaryButton,
  SecondaryButton,
  AccentButton,
  InfoCard,
  ContactCard,
} from "@/src/app/components/ui";

const DATE_TOP = "April 18, 2026";
const HASHTAG = "#YUNIZHAF";
const COUPLE = "Ayuni & Zhafirin";
const SUBLINE = "18.4.2026 | Luminare Hall, Petaling Jaya";
const RSVP_DEADLINE = "28 March 2026";

const CONTACTS = [
  { name: "Darwish (Bride’s)", phone: "012-846 2690" },
  { name: "Tasha (Bride’s)", phone: "011-635 54265" },
  { name: "Mai (Groom’s)", phone: "013-355 2455" },
  { name: "Elin (Groom’s)", phone: "019-226 6996" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen text-zinc-900 selection:bg-black/10">
      <div className="mx-auto max-w-6xl px-5 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-10">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden rounded-[28px] border border-white/40 bg-white/65 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        >
          <div className="grid lg:grid-cols-2">
            <div className="relative h-[300px] sm:h-[380px] lg:h-[560px]">
              <Image src="/hero.jpeg" alt="Wedding" fill priority className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

              <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                <Badge>{DATE_TOP}</Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="rounded-3xl border border-white/25 bg-white/75 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-900">
                    The Solemnization Of
                  </p>
                  <p className="mt-1 font-serif text-2xl font-semibold text-zinc-800 sm:text-3xl">
                    {COUPLE}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-zinc-700">
                {SUBLINE}
              </p>

              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                {HASHTAG}
              </h1>

              <h2 className="mt-3 font-serif text-xl font-semibold leading-tight sm:text-3xl">
                Mohd Sawal Bin Md Zain &
              </h2>
              <h2 className="font-serif text-xl font-semibold leading-tight sm:text-3xl">
                Cik Rosnani Binti Ismail
              </h2>

              <div className="mt-5">
                <p className="text-sm uppercase tracking-[0.22em] text-zinc-600">
                  Cordially invite YBhg. Tan Sri/ Puan Sri/ Dato&apos; Seri/ Datin Seri/ Dato&apos; Sri/
                  Datin Sri/ Datuk/ Dato&apos;/ Datin/ Mr./ Mrs./ Sir/ Ms. to attend The Solemnization
                  Ceremony between
                </p>

                <h2 className="mt-3 font-serif text-xl font-semibold leading-tight sm:text-3xl">
                  Nur Ayuni Binti Mohd Sawal &
                </h2>
                <h2 className="font-serif text-xl font-semibold leading-tight sm:text-3xl">
                  Zhafirin Farhan Bin Zainal Alam
                </h2>

                <p className="mt-4 text-[15px] leading-7 text-zinc-700">
                  We would be honoured to celebrate this special day with you.
                </p>
              </div>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <PrimaryButton href="/rsvp">Click to RSVP</PrimaryButton>
                <div className="text-sm text-zinc-600">
                  RSVP by <span className="font-semibold text-zinc-900">{RSVP_DEADLINE}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* OUR STORY */}
        <SectionCard className="mt-8">
          <p className="text-[15px] leading-7 text-zinc-700">
            “A love that doesn’t start with a lightning strike, but rather with the steady rhythm
            of shared footsteps and daily routines.”
          </p>
        </SectionCard>

        <MessageCarouselSection />

        {/* DETAILS */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mt-8"
        >
          <SectionCard>
            <SectionHeader
              label="Details"
              title="Schedule Preview"
              subtitle="Full schedule is on the Schedule page."
              action={<PrimaryButton href="/schedule">Open Full Schedule</PrimaryButton>}
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InfoCard time="8:00 AM" title="Family Arrival" />
              <InfoCard time="8:15 AM" title="Solemnisation Ceremony" />
              <InfoCard time="10:00 AM" title="Arrival of Guests" />
              <InfoCard time="12:30 PM" title="End of Ceremony" />
            </div>
          </SectionCard>
        </motion.section>

        {/* VENUE */}
        <section id="venue" className="mt-8">
          <SectionCard>
            <SectionHeader label="Venue" title="Luminare Hall, Petaling Jaya" />
            <p className="mt-4 text-[15px] leading-7 text-zinc-700">
              B-G-02, PJ TRADE CENTRE, 8, Jalan PJU 8/8A, Damansara Perdana, 47820
              Petaling Jaya, Selangor
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <SecondaryButton
                href="https://maps.app.goo.gl/dsUEjfK1u7NhSY386"
                icon={<FontAwesomeIcon icon={faGoogle} className="h-5 w-5" />}
              >
                Open in Google Maps
              </SecondaryButton>

              <AccentButton
                href="https://waze.com/ul/hw2860281s&navigate=yes"
                icon={<FontAwesomeIcon icon={faWaze} className="h-6 w-6" />}
              >
                Open in Waze
              </AccentButton>
            </div>
          </SectionCard>
        </section>

        {/* CONTACT */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mt-8"
        >
          <SectionCard>
            <SectionHeader
              label="Contact"
              title="Contacts"
              subtitle="If you have any questions, feel free to contact us."
              action={
                <Link
                  href="/contact"
                  className="hidden rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm text-zinc-800 backdrop-blur hover:bg-white sm:inline-flex"
                >
                  Open Contact Page
                </Link>
              }
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {CONTACTS.map((c) => (
                <ContactCard key={c.name} name={c.name} phone={c.phone} />
              ))}
            </div>

            <div className="mt-6 sm:hidden">
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm text-zinc-800 backdrop-blur hover:bg-white"
              >
                Open Contact Page
              </Link>
            </div>
          </SectionCard>
        </motion.section>

        <footer className="mt-10 text-center text-sm text-zinc-600">
          © {new Date().getFullYear()} {COUPLE}
        </footer>
      </div>
    </main>
  );
}