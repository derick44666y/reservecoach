import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ADMIN_KEY = "rc_admin_session";

export function useAdminAuth() {
  const isAuthed = sessionStorage.getItem(ADMIN_KEY) === "true";
  const login = () => sessionStorage.setItem(ADMIN_KEY, "true");
  const logout = () => {
    sessionStorage.removeItem(ADMIN_KEY);
    window.location.href = "/";
  };
  return { isAuthed, login, logout };
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [password, setPassword] = useState("");

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? "reservecoach2026";
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      login();
      navigate("/vault/dashboard");
    } else {
      toast.error("Invalid credentials");
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
            <Label htmlFor="password" className="font-body text-xs">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              placeholder="Enter admin password"
            />
          </div>
          <Button type="submit" className="w-full bg-primary font-body text-sm font-semibold text-primary-foreground">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
