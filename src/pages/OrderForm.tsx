import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppStore } from "@/store/AppStore";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

const orderSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(10, "Valid US phone number required").max(15),
  street: z.string().trim().min(1, "Street address is required").max(200),
  apt: z.string().max(50).optional(),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().min(2, "State is required"),
  zip: z.string().trim().min(5, "Valid ZIP required").max(10),
  notes: z.string().max(500).optional(),
});

const OrderForm = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getProductBySlug, addOrder } = useAppStore();
  const product = getProductBySlug(slug || "");
  const rawQty = parseInt(searchParams.get("qty") || "1", 10);
  const requestedQty = Math.min(5, Math.max(1, Number.isNaN(rawQty) ? 1 : rawQty));
  const stock = product?.stock ?? 0;
  const qty = Math.min(requestedQty, Math.max(0, stock));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const total = product.price * qty;
  const outOfStock = stock === 0;
  const orderImage = product.images?.length ? product.images[0] : "/placeholder.svg";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;

    const result = orderSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      setSubmitting(false);
      return;
    }

    const orderNum = addOrder({
      customerName: `${result.data.firstName} ${result.data.lastName}`.trim(),
      phone: result.data.phone,
      email: result.data.email,
      bag: product.name,
      qty,
      price: product.price,
      total: product.price * qty,
      status: "pending",
      street: result.data.street,
      city: result.data.city,
      state: result.data.state,
      zip: result.data.zip,
      notes: result.data.notes,
    });

    setErrors({});
    toast.success("Order placed successfully!");
    navigate(`/order-success?order=${orderNum}&name=${encodeURIComponent(result.data.firstName)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container max-w-lg py-6 md:py-10">
        <h1 className="mb-6 font-display text-2xl font-bold text-foreground">
          Complete Your Order
        </h1>

        {outOfStock && (
          <div className="mb-6 rounded-sm border border-destructive/50 bg-destructive/10 p-3 font-body text-sm text-destructive">
            This item is out of stock. You can’t place an order for it right now.
          </div>
        )}

        {/* Order summary */}
        <div className="mb-6 flex items-center gap-4 rounded-sm border border-border bg-card p-3">
          <img src={orderImage} alt={product.name} className="h-16 w-16 rounded-sm object-cover" />
          <div className="flex-1">
            <p className="font-display text-sm font-semibold text-foreground">{product.name}</p>
            <p className="font-body text-xs text-muted-foreground">Qty: {qty}{outOfStock ? " (out of stock)" : ""}</p>
          </div>
          <p className="font-body text-lg font-bold text-primary">${total}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName" className="font-body text-xs">First Name *</Label>
              <Input id="firstName" name="firstName" required className="mt-1" />
              {errors.firstName && <p className="mt-1 font-body text-xs text-destructive">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName" className="font-body text-xs">Last Name *</Label>
              <Input id="lastName" name="lastName" required className="mt-1" />
              {errors.lastName && <p className="mt-1 font-body text-xs text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="font-body text-xs">Email Address *</Label>
            <Input id="email" name="email" type="email" required className="mt-1" />
            {errors.email && <p className="mt-1 font-body text-xs text-destructive">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone" className="font-body text-xs">Phone Number *</Label>
            <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" required className="mt-1" />
            {errors.phone && <p className="mt-1 font-body text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="street" className="font-body text-xs">Street Address *</Label>
            <Input id="street" name="street" required className="mt-1" />
            {errors.street && <p className="mt-1 font-body text-xs text-destructive">{errors.street}</p>}
          </div>

          <div>
            <Label htmlFor="apt" className="font-body text-xs">Apt / Suite / Unit</Label>
            <Input id="apt" name="apt" className="mt-1" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="city" className="font-body text-xs">City *</Label>
              <Input id="city" name="city" required className="mt-1" />
              {errors.city && <p className="mt-1 font-body text-xs text-destructive">{errors.city}</p>}
            </div>
            <div>
              <Label htmlFor="state" className="font-body text-xs">State *</Label>
              <select
                id="state"
                name="state"
                required
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 font-body text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">--</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <p className="mt-1 font-body text-xs text-destructive">{errors.state}</p>}
            </div>
            <div>
              <Label htmlFor="zip" className="font-body text-xs">ZIP *</Label>
              <Input id="zip" name="zip" required className="mt-1" />
              {errors.zip && <p className="mt-1 font-body text-xs text-destructive">{errors.zip}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="font-body text-xs">Special Instructions</Label>
            <Textarea id="notes" name="notes" rows={3} className="mt-1 resize-none" placeholder="Any notes for your order..." />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={submitting || outOfStock}
            className="w-full bg-primary font-body text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "Placing Order..." : outOfStock ? "Out of stock" : `Place Order — $${total}`}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default OrderForm;
