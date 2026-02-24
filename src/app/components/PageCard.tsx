import React from "react";

export default function PageCard({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={[
                "rounded-[28px]",
                "border border-white/40",
                "bg-white/65",
                "shadow-[0_20px_60px_rgba(0,0,0,0.08)]",
                "backdrop-blur-xl",
                "p-6 sm:p-10",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}
