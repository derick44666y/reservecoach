import { cn } from "@/lib/utils";

export type OrderStatusType =
  | "pending"
  | "contacted"
  | "awaiting_payment"
  | "payment_received"
  | "confirmed_paid"
  | "packaging"
  | "shipped"
  | "delivered"
  | "cancelled";

const statusConfig: Record<OrderStatusType, { label: string; className: string }> = {
  pending: { label: "New / Pending", className: "bg-pending/15 text-pending border-pending/30" },
  contacted: { label: "Contacted", className: "bg-info/15 text-info border-info/30" },
  awaiting_payment: { label: "Awaiting Payment", className: "bg-pending/15 text-pending border-pending/30" },
  payment_received: { label: "Payment Received", className: "bg-primary/15 text-primary border-primary/30" },
  confirmed_paid: { label: "Confirmed Paid", className: "bg-success/15 text-success border-success/30" },
  packaging: { label: "Packaging", className: "bg-info/15 text-info border-info/30" },
  shipped: { label: "Shipped", className: "bg-success/15 text-success border-success/30" },
  delivered: { label: "Delivered", className: "bg-success/15 text-success border-success/30" },
  cancelled: { label: "Cancelled", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

export const orderStatuses: OrderStatusType[] = [
  "pending", "contacted", "awaiting_payment", "payment_received",
  "confirmed_paid", "packaging", "shipped", "delivered", "cancelled",
];

interface OrderStatusBadgeProps {
  status: OrderStatusType;
  className?: string;
}

const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 font-body text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
export { statusConfig };
