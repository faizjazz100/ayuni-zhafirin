import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RsvpForm from "@/src/app/components/RsvpForm";
import PageShell from "@/src/app/components/PageShell";

export default async function RSVPPrivatePage() {
    const cookieStore = await cookies();
    const guestType = cookieStore.get("guestType")?.value;

    if (guestType !== "private") {
        redirect("/rsvp");
    }

    return (
        <main className="min-h-screen text-zinc-800">
            <PageShell>
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                    RSVP
                </p>
                <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">
                    Confirm Attendance
                </h1>
                <p className="mt-2 font-semibold ">
                    8:00AM - 12:00PM | 18.4.2026, Saturday | Luminare Hall, Petaling Jaya
                </p>
                <p className="mt-3 text-sm text-zinc-600">
                    This RSVP is for the <b>Private</b> session.
                </p>

                <RsvpForm session="Private" />

                <div className="mt-8 text-sm text-zinc-500">
                    Need help?{" "}
                    <Link href="/contact" className="font-medium text-zinc-900">
                        Contact us →
                    </Link>
                </div>
            </PageShell>
        </main>
    );
}