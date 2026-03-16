import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAdminAuth } from "./AdminLogin";
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react";

const navItems = [
  { to: "/vault/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/vault/products", label: "Products", icon: Package },
  { to: "/vault/orders", label: "Orders", icon: ShoppingBag },
];

const AdminLayout = () => {
  const { isAuthed, logout } = useAdminAuth();
  const location = useLocation();

  if (!isAuthed) return <Navigate to="/vault/login" replace />;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-56 flex-col border-r border-border bg-card">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link to="/vault/dashboard" className="font-display text-base font-bold text-foreground">
            RC Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2.5 rounded-sm px-3 py-2 font-body text-sm transition-colors ${
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-2">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 font-body text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
