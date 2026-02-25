"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWaze, faGoogle } from "@fortawesome/free-brands-svg-icons";
import Iridescence from "@/src/app/components/backgrounds/Iridescence";
import MessageCarouselSection from "./components/MessageCarouselSection";

export default function HomePage() {
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

  const toMYWa = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("60")) return digits;
    if (digits.startsWith("0")) return "6" + digits;
    return digits;
  };

  return (
    <main className="min-h-screen text-zinc-900 selection:bg-black/10">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Iridescence color={[0.3, 0.6, 1]} mouseReact amplitude={0.12} speed={1} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/45 to-white/75" />
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-black/5 blur-3xl" />
        <div className="absolute -right-40 bottom-[-180px] h-[520px] w-[520px] rounded-full bg-black/5 blur-3xl" />
      </div>

      {/* WRAPPER */}
      <div className="mx-auto max-w-6xl px-5 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-10">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden rounded-[28px] border border-white/40 bg-white/65 shadow-[0_20px_60px_rgba(0,0,0,0.08)] "
        >
          <div className="grid lg:grid-cols-2">
            {/* Image */}
            <div className="relative h-[300px] sm:h-[380px] lg:h-[560px]">
              <Image
                src="/hero.jpeg"
                alt="Wedding"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

              <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                <Badge>{DATE_TOP}</Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="rounded-3xl border border-white/25 bg-white/35 p-4 ">
                  <p className="text-xs uppercase tracking-[0.28em] font-semibold text-zinc-900">
                    The Solemnization Of
                  </p>
                  <p className="mt-1 font-serif text-2xl font-semibold text-zinc-800 sm:text-3xl">
                    {COUPLE}
                  </p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="p-6 sm:p-10 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-zinc-700">
                {SUBLINE}
              </p>

              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                {HASHTAG}
              </h1>

              <div className="mt-5">
                <p className="text-sm uppercase tracking-[0.22em] text-zinc-600">
                  You’re invited to attend the solemnization ceremony between
                </p>

                <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight sm:text-3xl">
                  Nur Ayuni Binti Mohd Sawal & Zhafirin Farhan Bin Zainal Alam
                </h2>

                <p className="mt-4 text-[15px] leading-7 text-zinc-700">
                  We would be honoured to celebrate this special day with you.
                </p>
              </div>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <PrimaryButton href="/rsvp">RSVP</PrimaryButton>

                <div className="text-sm text-zinc-600">
                  RSVP by{" "}
                  <span className="font-semibold text-zinc-900">
                    {RSVP_DEADLINE}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <MessageCarouselSection />

        {/* OUR STORY */}
        <SectionCard className="mt-8">
          <SectionHeader
            label="Our Story"
            title="How it all started"
            action={
              <Link
                href="/our-story"
                className="hidden rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm text-zinc-800 backdrop-blur hover:bg-white sm:inline-flex"
              >
                View more
              </Link>
            }
          />

          <p className="mt-4 text-[15px] leading-7 text-zinc-700">
            They met two years ago on the same working pathway, where their daily
            routines crossed without much thought. Both were focused on their
            careers, exchanging nothing more than brief greetings and occasional
            smiles, friendly acquaintances in a busy world.
          </p>

          <div className="mt-6 sm:hidden">
            <Link
              href="/our-story"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm text-zinc-800 backdrop-blur hover:bg-white"
            >
              View more
            </Link>
          </div>
        </SectionCard>

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
              title="Contact"
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
                <div
                  key={c.name}
                  className="rounded-3xl border border-black/10 bg-white/65 p-6 hover:bg-white/80"
                >
                  <p className="text-sm text-zinc-600">{c.name}</p>
                  <p className="mt-1 text-lg font-semibold text-zinc-900">
                    {c.phone}
                  </p>

                  <div className="mt-4 flex gap-3">
                    <a
                      className="inline-flex flex-1 items-center justify-center rounded-2xl bg-black px-4 py-2 text-sm text-white hover:opacity-90"
                      href={`tel:${c.phone.replace(/\D/g, "")}`}
                    >
                      Call
                    </a>
                    <a
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm text-zinc-900 hover:bg-white"
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

            <div className="mt-8 text-center text-sm text-zinc-600">
              Thank you, see you there.
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

        {/* FOOTER */}
        <footer className="mt-10 text-center text-sm text-zinc-600">
          © {new Date().getFullYear()} {COUPLE}
        </footer>
      </div>

      <style jsx global>{`
        .font-serif {
          font-family: var(--font-serif), ui-serif, Georgia, serif;
        }
      `}</style>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/35 bg-white/65 px-4 py-2 text-xs font-bold tracking-[0.28em] text-zinc-800 backdrop-blur">
      {children}
    </div>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={[
        "rounded-[28px] border border-white/40 bg-white/65 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)]  sm:p-10",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  label,
  title,
  subtitle,
  action,
}: {
  label: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-600">
          {label}
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-zinc-900">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-sm text-zinc-600">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white shadow-sm hover:opacity-90"
    >
      {children}
    </Link>
  );
}

function AccentButton({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium text-white shadow-sm hover:opacity-90"
      style={{ backgroundColor: "#0099FF" }}
    >
      {children}
      {icon}
    </a>
  );
}

function SecondaryButton({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-5 py-3 text-sm font-medium text-zinc-900 backdrop-blur hover:bg-white"
    >
      {children}
      {icon}
    </a>
  );
}

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-800 backdrop-blur hover:bg-white"
    >
      {children}
    </Link>
  );
}

function InfoCard({ time, title }: { time: string; title: string }) {
  return (
    <div className="group flex items-start justify-between gap-4 rounded-3xl border border-black/10 bg-white/70 px-5 py-4 backdrop-blur hover:bg-white/85">
      <div className="text-base font-semibold text-zinc-900">{time}</div>
      <div className="text-sm text-zinc-700 text-right">{title}</div>
    </div>
  );
}
