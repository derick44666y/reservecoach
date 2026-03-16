import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api, setAuthToken, clearAuthToken, getAuthToken } from "@/lib/api";

export function useAdminAuth() {
  const isAuthed = !!getAuthToken();
  const login = (token: string) => setAuthToken(token);
  const logout = () => {
    clearAuthToken();
    window.location.href = "/";
  };
  return { isAuthed, login, logout };
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Email and password required");
      return;
    }
    setSubmitting(true);
    try {
      const data = await api.post<{ token: string }>("/api/auth/login", { email: email.trim(), password });
      if (data?.token) {
        login(data.token);
        toast.success("Signed in");
        navigate("/vault/dashboard");
      } else {
        toast.error("Invalid response");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 p-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Reserve Coach</h1>
          <p className="mt-1 font-body text-sm text-muted-foreground">Admin Access</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="font-body text-xs">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="password" className="font-body text-xs">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              placeholder="Password"
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary font-body text-sm font-semibold text-primary-foreground"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
