"use client";

import dynamic from "next/dynamic";

const Iridescence = dynamic(
    () => import("./backgrounds/Iridescence"),
    { ssr: false }
);

export default function AppBackground() {
    return (
        <div className="pointer-events-none fixed inset-0 -z-10">
            <Iridescence
                color={[0.3, 0.6, 1]}
                mouseReact
                amplitude={0.12}
                speed={1}
            />

            {/* soft white overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/45 to-white/75" />

            {/* blobs */}
            <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-black/5 blur-3xl" />
            <div className="absolute -right-40 bottom-[-180px] h-[520px] w-[520px] rounded-full bg-black/5 blur-3xl" />
        </div>
    );
}
