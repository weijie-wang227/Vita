import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state";
import { Badge, Button, Card, Input } from "../components/ui";

export function AuthPage() {
  const { login, signup } = useAppState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const success = await login(form.email, form.password);
        if (success) return navigate("/dashboard");
        setError("Unable to find an account with those credentials.");
      } else {
        const success = await signup({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        if (success) return navigate("/dashboard");
        setError("Email is already in use. Please choose a different address.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[480px_auto] lg:items-center">
        <div className="space-y-6">
          <Badge>Member access</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-300 sm:text-5xl">
            Log in or join and start booking your next wellness class.
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-600">
            Create your profile, earn credits, add friends, and discover classes
            that fit your routine.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                New members
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                Create an account in minutes with a membership plan ready to
                apply.
              </p>
            </Card>
            <Card>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Returning members
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                Log in and resume booking from your personalized dashboard.
              </p>
            </Card>
          </div>
        </div>
        <Card className="space-y-6 bg-slate-950 text-white">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">
              {mode === "login" ? "Sign in" : "Create account"}
            </p>
            <h2 className="text-2xl font-semibold">
              {mode === "login" ? "Welcome back" : "Join Vita today"}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" ? (
              <Input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            ) : null}
            <Input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : mode === "login" ? "Log in" : "Sign up"}
            </Button>
          </form>
          <div className="text-sm text-slate-300">
            <button
              type="button"
              className="font-semibold text-indigo-300 hover:text-white"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
              disabled={loading}
            >
              {mode === "login"
                ? "Need an account? Create one"
                : "Already have an account? Log in"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
