import { useParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import OrderStatusBadge, { OrderStatusType } from "@/components/OrderStatusBadge";
import { Package } from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import { useOrder } from "@/hooks/useApi";
import { getApiUrl } from "@/lib/api";

const statusMessages: Record<OrderStatusType, string> = {
  pending: "Your order has been received. We'll contact you shortly with payment instructions.",
  contacted: "We've reached out to you with payment details. Please check your texts or email.",
  awaiting_payment: "Waiting for your payment. Send it to the details we texted you.",
  payment_received: "We received your payment screenshot. Verifying now — won't take long!",
  confirmed_paid: "Payment confirmed — thank you! Your order is now being prepared.",
  packaging: "Your bag is being carefully packaged. Tracking info coming within 24 hours.",
  shipped: "Your order has been shipped! Check your texts or email for the tracking number.",
  delivered: "Your bag has been delivered. Enjoy it! 💛",
  cancelled: "This order has been cancelled. Reach out if you have questions.",
};

const OrderStatus = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder } = useAppStore();
  const { data: apiOrder, isLoading, isError } = useOrder(orderId);
  const storeOrder = orderId ? getOrder(orderId) : undefined;
  const order = getApiUrl() ? apiOrder : storeOrder;
  const displayOrder = order ?? {
    status: "pending" as OrderStatusType,
    customerName: "Customer",
    bag: "Your Bag",
  };

  if (getApiUrl() && isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container flex max-w-md flex-col items-center py-16 text-center">
          <p className="font-body text-muted-foreground">Loading…</p>
        </main>
      </div>
    );
  }
  if (getApiUrl() && isError) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container flex max-w-md flex-col items-center py-16 text-center">
          <p className="font-body text-muted-foreground">Order not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container flex max-w-md flex-col items-center py-16 text-center">
        <Package className="h-12 w-12 text-primary" />
        <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
          Order {orderId}
        </h1>
        <div className="mt-3">
          <OrderStatusBadge status={displayOrder.status} />
        </div>
        {order && (
          <p className="mt-2 font-body text-sm text-muted-foreground">
            {displayOrder.bag} × {displayOrder.qty}
          </p>
        )}
        <p className="mt-4 font-body text-sm text-muted-foreground">
          {statusMessages[displayOrder.status]}
        </p>
        <p className="mt-8 font-body text-xs text-muted-foreground">
          Questions? Reply to the text or email we sent you.
        </p>
      </main>
    </div>
  );
};

export default OrderStatus;
