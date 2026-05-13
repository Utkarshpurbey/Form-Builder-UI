"use client";

import { useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import useLogin from "@/src/hooks/useLogin";
import { useAuth } from "@/src/context/AuthContext";
import { userFromLoginResponse } from "@/src/lib/userFromLoginResponse";
import { toast } from "react-toastify";

export default function LoginRoutePage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { handleLogin, loginState } = useLogin();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const successHandledRef = useRef(false);

  useEffect(() => {
    if (loginState?.isLoading) successHandledRef.current = false;
  }, [loginState?.isLoading]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    emailRef.current = email;
    passwordRef.current = password;
    handleLogin(email, password);
  };

  useEffect(() => {
    if (!loginState?.isSuccess || !loginState.data || successHandledRef.current) return;
    successHandledRef.current = true;
    const user = userFromLoginResponse(loginState.data, emailRef.current);
    if (user)
      setUser(user, {
        loginId: emailRef.current || user.email,
        password: passwordRef.current,
      });
    toast.success("Signed in successfully.");
    router.push("/workspace");
    router.refresh();
  }, [loginState?.isSuccess, loginState.data, setUser, router]);

  const errorMessage = loginState?.isFailed ? loginState?.error?.message : null;

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Welcome back</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Sign in to Formvity</h2>
          <p className="mt-2 text-sm text-slate-500">Wire this form to your auth API when ready.</p>
        </div>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
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
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={loginState?.isLoading}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {loginState?.isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          New here?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Create an account
          </button>
        </p>
      </section>
    </div>
  );
}
