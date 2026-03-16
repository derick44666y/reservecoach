import { useState } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAdminAuth } from "./AdminLogin";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/vault/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/vault/products", label: "Products", icon: Package },
  { to: "/vault/orders", label: "Orders", icon: ShoppingBag },
];

const AdminLayout = () => {
  const { isAuthed, logout } = useAdminAuth();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (!isAuthed) return <Navigate to="/vault/login" replace />;

  const NavLinks = () => (
    <>
      {navItems.map(({ to, label, icon: Icon }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={() => setMobileNavOpen(false)}
            className={`flex items-center gap-2.5 rounded-sm px-3 py-2.5 font-body text-sm transition-colors min-h-[44px] ${
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
      <button
        type="button"
        onClick={() => { setMobileNavOpen(false); logout(); }}
        className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 font-body text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground min-h-[44px]"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </>
  );

  return (
    <div className="flex min-h-[100dvh] bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-56 flex-col border-r border-border bg-card">
        <div className="flex h-14 items-center border-b border-border px-4 shrink-0">
          <Link to="/vault/dashboard" className="font-display text-base font-bold text-foreground">
            RC Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 p-2 overflow-auto">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2.5 rounded-sm px-3 py-2 font-body text-sm transition-colors ${
                  active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-2 shrink-0">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 font-body text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header + menu */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 min-w-10 touch-manipulation"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/vault/dashboard" className="font-display text-base font-bold text-foreground" onClick={() => setMobileNavOpen(false)}>
            RC Admin
          </Link>
          <div className="w-10" />
        </header>
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
            <div className="flex h-14 items-center border-b border-border px-4">
              <span className="font-display text-base font-bold text-foreground">Menu</span>
            </div>
            <nav className="flex-1 space-y-0.5 p-2 overflow-auto">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex-1 overflow-auto min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
