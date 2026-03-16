import { useSearchParams, Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import { CheckCircle, Copy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderNum = searchParams.get("order") || "RC-00000";
  const name = searchParams.get("name") || "";

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNum);
    toast.success("Order number copied to clipboard");
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background">
      <SiteHeader />
      <main className="container flex max-w-md flex-col items-center py-12 px-4 text-center">
        <CheckCircle className="h-16 w-16 text-success" />
        <h1 className="mt-6 font-display text-3xl font-bold text-foreground">
          Order Received!
        </h1>
        <p className="mt-2 font-body text-sm text-muted-foreground">
          {name && `Thanks ${name}! `}Your order{" "}
          <span className="font-semibold text-primary">{orderNum}</span> has been placed.
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 gap-1.5 min-h-[44px] font-body text-xs text-muted-foreground hover:text-foreground touch-manipulation"
          onClick={copyOrderNumber}
        >
          <Copy className="h-3.5 w-3.5" />
          Copy order number
        </Button>
        <div className="mt-6 rounded-sm border border-border bg-card p-5 text-left">
          <h2 className="font-display text-base font-semibold text-foreground">What happens next?</h2>
          <ol className="mt-3 space-y-2 font-body text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary font-body text-[10px] font-bold text-primary-foreground">1</span>
              We'll text or email you within the hour with payment details.
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary font-body text-[10px] font-bold text-primary-foreground">2</span>
              Send payment via Zelle, Cash App, or Venmo (friends & family).
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary font-body text-[10px] font-bold text-primary-foreground">3</span>
              Once confirmed, we'll ship your bag with tracking — usually within 48 hours.
            </li>
          </ol>
        </div>
        <p className="mt-4 font-body text-xs text-muted-foreground">
          Keep your phone handy — check texts and email. If you need anything, message us anytime.
        </p>

        {/* Concierge contact */}
        <div className="mt-4 flex w-full flex-col gap-2">
          <a
            href="https://wa.me/12294954037"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              variant="outline"
              className="w-full min-h-[44px] gap-2 font-body text-xs uppercase tracking-wider touch-manipulation"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp concierge
            </Button>
          </a>
          <a
            href="https://www.tiktok.com/@reservecoach?_r=1&_t=ZS-94jMRfOPZCr"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              variant="ghost"
              className="w-full min-h-[44px] gap-2 font-body text-xs uppercase tracking-wider touch-manipulation"
            >
              View TikTok updates
            </Button>
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to={`/order-status/${orderNum}`} className="w-full sm:w-auto">
            <Button variant="default" className="w-full min-h-[48px] font-body text-xs uppercase tracking-wider bg-primary text-primary-foreground touch-manipulation">
              Track your order
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full min-h-[48px] font-body text-xs uppercase tracking-wider touch-manipulation">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;
