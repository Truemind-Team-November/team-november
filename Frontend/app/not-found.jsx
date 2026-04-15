import Link from "next/link";
import { ThemeColors } from "@/components/ThemeColors";

export default function NotFound() {
  return (
    <main
      style={{ backgroundColor: ThemeColors.bgBlue }}
      className="min-h-screen text-zinc-300 font-sans p-4 md:p-8"
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-xl w-full rounded-3xl border border-slate-700 bg-slate-950/70 p-10 text-center shadow-xl shadow-slate-900/40">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-300 mb-4">
            Page not found
          </p>
          <h1 className="text-5xl font-bold text-white mb-4">404</h1>
          <p className="text-zinc-400 mb-8">
            The page you were looking for does not exist. You can return to the
            signup page or continue browsing the app.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Go to Home
            </Link>
            <Link
              href="/signup"
              className="rounded-xl border border-blue-500 px-6 py-3 text-sm font-semibold text-blue-100 hover:bg-blue-700/10 transition"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
