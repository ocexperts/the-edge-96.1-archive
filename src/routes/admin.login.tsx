import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent, useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
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
  const { user, isAdmin, loading } = useAuth();
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate({ to: "/admin" });
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
          <h1 className="font-display text-3xl text-white">Admin Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Moderators only. Accounts are provisioned manually.
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-deep-purple/60 border border-hot-pink/30 rounded-md px-3 py-2 text-sm outline-none focus:border-hot-pink"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {user && !isAdmin && !loading && (
            <p className="text-sm text-amber-400">
              Signed in but not an admin. Ask the site owner to grant you the admin role.
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-hot-pink hover:bg-hot-pink/90 disabled:opacity-60 text-hot-pink-foreground font-display tracking-widest px-6 py-3 rounded-lg shadow-pink"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            SIGN IN
          </button>
          <p className="text-xs text-muted-foreground">
            <Link to="/" className="underline">Back to site</Link>
          </p>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
