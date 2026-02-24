import PageCard from "./PageCard";

export default function PageShell({
    children,
    maxWidth = "max-w-3xl",
}: {
    children: React.ReactNode;
    maxWidth?: string;
}) {
    return (
        <main className="min-h-screen text-zinc-900 selection:bg-black/10">
            <section className={`mx-auto ${maxWidth} px-5 pb-14 pt-6 sm:px-6 sm:pt-10`}>
                <PageCard>{children}</PageCard>
            </section>
        </main>
    );
}
