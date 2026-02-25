import Link from "next/link";
import PageShell from "@/src/app/components/PageShell";

export default async function RsvpSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;

    const rawName = params?.name;
    const name = Array.isArray(rawName) ? rawName[0] : rawName;

    return (
        <main className="min-h-screen px-5 py-16">
            <div className="mx-auto max-w-2xl text-center">
                <PageShell>
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                        Thank You
                    </p>

                    <h1 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl">
                        {name ? `${name}` : ""}
                    </h1>

                    <p className="mt-6 text-zinc-600">
                        We have received your response!
                    </p>

                    <Link
                        href="/"
                        className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-sm text-white hover:opacity-90"
                    >
                        Back to Home
                    </Link>
                </PageShell>
            </div>
        </main>
    );
}