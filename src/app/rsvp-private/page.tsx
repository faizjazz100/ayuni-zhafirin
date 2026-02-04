import Link from "next/link";
import RsvpForm from "@/src/app/components/RsvpForm";

export default function RSVPPage() {
    return (
        <main className="min-h-screen text-zinc-800">
            <section className="mx-auto max-w-2xl px-5 pb-14">
                <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
                    <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                        RSVP
                    </p>
                    <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">
                        Confirm Attendance
                    </h1>
                    <p className="mt-3 text-sm text-zinc-600">
                        This RSVP is for the <b>Private</b> session.
                    </p>

                    <RsvpForm session="Private" />

                    <div className="mt-8 text-sm text-zinc-500">
                        Need help?{" "}
                        <Link href="/#contact" className="font-medium text-zinc-900">
                            Contact us →
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
