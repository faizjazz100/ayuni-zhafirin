"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Signing in...");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("✅ Signed in");
    router.push("/admin");
  }

  return (
    <main className="mx-auto max-w-md p-6 text-zinc-800">
      <h1 className="text-3xl font-semibold">Admin Login</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            className="mt-1 w-full rounded-xl border p-3 text-zinc-800"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            className="mt-1 w-full rounded-xl border p-3 text-zinc-800"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="w-full rounded-xl bg-black p-3 text-white">
          Sign in
        </button>

        {status && <p className="text-sm text-gray-700">{status}</p>}
      </form>
    </main>
  );
}
