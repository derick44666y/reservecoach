import { useState } from "react";
import OrderStatusBadge, { OrderStatusType, orderStatuses } from "@/components/OrderStatusBadge";
import { Eye, Copy, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAppStore, type Order } from "@/store/AppStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useAppStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusType | "all">("all");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()) || o.bag.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleStatusChange = (orderId: string, status: OrderStatusType) => {
    updateOrderStatus(orderId, status);
    setViewOrder((prev) => (prev && prev.id === orderId ? { ...prev, status } : prev));
    toast.success("Status updated");
  };

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Orders</h1>
      <p className="mt-1 font-body text-sm text-muted-foreground">{orders.length} total orders</p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, order #, or bag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 font-body text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatusType | "all")}
          className="h-10 rounded-md border border-input bg-background px-3 font-body text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All Statuses</option>
          {orderStatuses.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-sm border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">Order</th>
              <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">Bag</th>
              <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center font-body text-sm text-muted-foreground">
                  No orders match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id} className="border-b border-border transition-colors hover:bg-secondary/30">
                  <td className="px-4 py-3 font-body text-sm font-semibold text-foreground">{o.id}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-body text-xs text-muted-foreground">{o.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-body text-sm text-foreground">{o.customerName}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(o.phone)}
                        title="Copy phone"
                        className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="font-body text-xs text-muted-foreground">{o.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-body text-sm text-foreground">{o.bag}</p>
                    <p className="font-body text-xs text-muted-foreground">× {o.qty}</p>
                  </td>
                  <td className="px-4 py-3 font-body text-sm font-semibold text-foreground">${o.total}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setViewOrder(o)}
                      className="rounded-sm p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      title="View order"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Sheet open={!!viewOrder} onOpenChange={(open) => !open && setViewOrder(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {viewOrder && (
            <>
              <SheetHeader>
                <SheetTitle className="font-display">Order {viewOrder.id}</SheetTitle>
                <SheetDescription>{viewOrder.date}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <Label className="font-body text-xs text-muted-foreground">Status</Label>
                  <select
                    value={viewOrder.status}
                    onChange={(e) => handleStatusChange(viewOrder.id, e.target.value as OrderStatusType)}
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 font-body text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {orderStatuses.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="font-body text-xs text-muted-foreground">Customer</Label>
                  <p className="mt-1 font-body text-sm text-foreground">{viewOrder.customerName}</p>
                  <p className="font-body text-xs text-muted-foreground">{viewOrder.email}</p>
                  <p className="font-body text-xs text-muted-foreground">{viewOrder.phone}</p>
                </div>
                {viewOrder.street && (
                  <div>
                    <Label className="font-body text-xs text-muted-foreground">Address</Label>
                    <p className="mt-1 font-body text-sm text-foreground">
                      {[viewOrder.street, viewOrder.city, viewOrder.state, viewOrder.zip].filter(Boolean).join(", ")}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="font-body text-xs text-muted-foreground">Items</Label>
                  <p className="mt-1 font-body text-sm text-foreground">{viewOrder.bag} × {viewOrder.qty}</p>
                  <p className="font-body text-sm font-semibold text-primary">${viewOrder.total}</p>
                </div>
                {viewOrder.notes && (
                  <div>
                    <Label className="font-body text-xs text-muted-foreground">Notes</Label>
                    <p className="mt-1 font-body text-sm text-muted-foreground">{viewOrder.notes}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminOrders;
