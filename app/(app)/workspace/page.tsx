"use client";

import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";

export default function WorkspacePage() {
  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:py-10">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {user?.name ? `Hi ${user.name}` : "Your workspace"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Create and manage workspaces, members, and billing here. Published forms for <strong className="font-semibold text-slate-800">respondents</strong> will open on
            their own public links—not on this screen.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Workspaces</h2>
            <p className="mt-2 text-sm text-slate-600">You have no workspaces yet. This list will fill from your API.</p>
            <button
              type="button"
              disabled
              className="mt-4 inline-flex h-10 items-center rounded-lg bg-slate-100 px-4 text-sm font-medium text-slate-400 cursor-not-allowed"
            >
              Create workspace (soon)
            </button>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Members & roles</h2>
            <p className="mt-2 text-sm text-slate-600">Invite teammates and set permissions once workspace APIs are wired.</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-semibold text-slate-900">Forms & builder</h2>
            <p className="mt-2 text-sm text-slate-600">Design forms in the visual builder. Sharing and submission links will come from publish flows.</p>
            <Link
              href="/builder"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Open builder
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
