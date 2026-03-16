import { ShoppingBag, Package, DollarSign, Clock } from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import OrderStatusBadge from "@/components/OrderStatusBadge";

const AdminDashboard = () => {
  const { products, orders } = useAppStore();

  const pendingStatuses = ["pending", "contacted", "awaiting_payment", "payment_received"] as const;
  const pendingCount = orders.filter((o) => pendingStatuses.includes(o.status)).length;
  const newTodayCount = orders.filter((o) => o.status === "pending").length;
  const revenue = orders
    .filter((o) => ["confirmed_paid", "packaging", "shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);
  const recentOrders = orders.slice(0, 8);

  const stats = [
    { label: "New / Pending", value: String(newTodayCount), icon: Clock, color: "text-pending" },
    { label: "Pending (all)", value: String(pendingCount), icon: ShoppingBag, color: "text-info" },
    { label: "Total Products", value: String(products.length), icon: Package, color: "text-primary" },
    { label: "Revenue (confirmed)", value: `$${revenue.toLocaleString()}`, icon: DollarSign, color: "text-success" },
  ];

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 font-body text-sm text-muted-foreground">Quick overview of your store.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-sm border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-sm border border-border bg-card p-5">
        <h2 className="font-display text-lg font-semibold text-foreground">Recent orders</h2>
        <div className="mt-4 space-y-3">
          {recentOrders.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            recentOrders.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
                <span className="font-body text-sm font-semibold text-foreground">{o.id}</span>
                <span className="font-body text-sm text-muted-foreground">—</span>
                <span className="font-body text-sm text-foreground">{o.bag}</span>
                <span className="font-body text-xs text-muted-foreground">${o.total}</span>
                <OrderStatusBadge status={o.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
