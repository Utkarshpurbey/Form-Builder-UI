"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setIsSubmitting(true);
    const hasValidEmail = /\S+@\S+\.\S+/.test(email);
    const hasValidPassword = password.length >= 6;

    if (!name || !hasValidEmail || !hasValidPassword) {
      setErrorMessage("Enter name, a valid email, and a password of at least 6 characters.");
      toast.error("Registration details are incomplete.");
      setTimeout(() => setIsSubmitting(false), 300);
      return;
    }

    setErrorMessage(null);
    toast.success("Account created. You are all set!");
    router.push("/workspace");
    router.refresh();
    setTimeout(() => setIsSubmitting(false), 300);
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Get started</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Create your Formvity account</h2>
          <p className="mt-2 text-sm text-slate-500">Connect this flow to your registration API when you are ready.</p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={handleRegister}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Full name</span>
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Utkarsh Sharma"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Work email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Company (optional)</span>
            <input
              name="company"
              type="text"
              placeholder="Formvity Labs"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already registered?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Log in
          </button>
        </p>
      </section>
    </div>
  );
}
