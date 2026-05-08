import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/hooks/use-auth";
import { login, signup } from "@/lib/auth.functions";
import bgPattern from "@/assets/bg-pattern.jpg";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — The Edge 96.1 Memorial" },
      { name: "description", content: "Sign in to moderate stories." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, refresh } = useAuth();
  const loginFn = useServerFn(login);
  const signupFn = useServerFn(signup);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate({ to: "/admin" });
    }
  }, [loading, user, isAdmin, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fn = mode === "login" ? loginFn : signupFn;
      await fn({ data: { email, password } });
      await refresh();
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen text-foreground"
      style={{
        backgroundImage: `linear-gradient(180deg, oklch(0.18 0.12 320 / 0.85), oklch(0.14 0.10 310 / 0.95)), url(${bgPattern})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <SiteHeader />
      <main className="container mx-auto px-4 py-16 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl border border-hot-pink/30 bg-card/60 backdrop-blur p-8 space-y-4"
        >
          <h1 className="font-display text-3xl text-white">
            {mode === "login" ? "Admin Sign In" : "Create Admin Account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "login"
              ? "Moderators only."
              : "The first account created becomes the admin automatically."}
          </p>
          <label className="block">
            <span className="text-xs tracking-widest text-hot-pink">EMAIL</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-deep-purple/60 border border-hot-pink/30 rounded-md px-3 py-2 text-sm outline-none focus:border-hot-pink"
            />
          </label>
          <label className="block">
            <span className="text-xs tracking-widest text-hot-pink">PASSWORD</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-deep-purple/60 border border-hot-pink/30 rounded-md px-3 py-2 text-sm outline-none focus:border-hot-pink"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {user && !isAdmin && !loading && (
            <p className="text-sm text-amber-400">
              Signed in but not an admin. Ask the site owner to grant the admin role.
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-hot-pink hover:bg-hot-pink/90 disabled:opacity-60 text-hot-pink-foreground font-display tracking-widest px-6 py-3 rounded-lg shadow-pink"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
          <div className="text-xs text-center text-muted-foreground">
            {mode === "login" ? (
              <button type="button" onClick={() => setMode("signup")} className="underline">
                Need to create the first admin? Sign up
              </button>
            ) : (
              <button type="button" onClick={() => setMode("login")} className="underline">
                Have an account? Sign in
              </button>
            )}
          </div>
          <div className="text-xs text-center">
            <Link to="/" className="text-muted-foreground underline">
              Back to home
            </Link>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
