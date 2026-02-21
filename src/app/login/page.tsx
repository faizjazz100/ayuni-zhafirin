import { Suspense } from "react";
import LoginClient from "@/src/app/login/LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen px-5 py-10 text-zinc-800">Loading...</div>}>
      <LoginClient />
    </Suspense>
  );
}
