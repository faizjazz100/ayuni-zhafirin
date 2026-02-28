import Link from "next/link";

const toMYWa = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("60")) return digits;
    if (digits.startsWith("0")) return "6" + digits;
    return digits;
};

export function Badge({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-white/35 bg-white/65 px-4 py-2 text-xs font-bold tracking-[0.28em] text-zinc-800 backdrop-blur">
            {children}
        </div>
    );
}

export function SectionCard({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={[
                "rounded-[28px] border border-white/40 bg-white/65 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-10",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}

export function SectionHeader({
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
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-600">{label}</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-zinc-900">{title}</h2>
                {subtitle ? <p className="mt-2 text-sm text-zinc-600">{subtitle}</p> : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    );
}

export function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white shadow-sm hover:opacity-90"
        >
            {children}
        </Link>
    );
}

export function AccentButton({
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

export function SecondaryButton({
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

export function InfoCard({ time, title }: { time: string; title: string }) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-3xl border border-black/10 bg-white/70 px-5 py-4 backdrop-blur hover:bg-white/85">
            <div className="text-base font-semibold text-zinc-900">{time}</div>
            <div className="text-sm text-zinc-700 text-right">{title}</div>
        </div>
    );
}

export function ContactCard({ name, phone }: { name: string; phone: string }) {
    return (
        <div className="rounded-3xl border border-black/10 bg-white/65 p-6 hover:bg-white/80">
            <p className="text-sm text-zinc-600">{name}</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">{phone}</p>

            <div className="mt-4 flex gap-3">
                <a
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-black px-4 py-2 text-sm text-white hover:opacity-90"
                    href={`tel:${phone.replace(/\D/g, "")}`}
                >
                    Call
                </a>
                <a
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm text-zinc-900 hover:bg-white"
                    href={`https://wa.me/${toMYWa(phone)}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    WhatsApp
                </a>
            </div>
        </div>
    );
}