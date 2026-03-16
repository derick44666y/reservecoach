import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppStore } from "@/store/AppStore";
import ProductGallery from "@/components/ProductGallery";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Shield, Truck, MessageCircle, Minus, Plus } from "lucide-react";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getProductBySlug } = useAppStore();
  const product = getProductBySlug(slug || "");
  const maxQty = product ? Math.min(5, Math.max(0, product.stock)) : 0;
  const [qty, setQty] = useState(() => (maxQty >= 1 ? 1 : 0));

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const handleOrder = () => {
    navigate(`/order/${product.slug}?qty=${qty}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <SiteHeader />
      <main className="container py-6 md:py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <ProductGallery images={product.images} name={product.name} />

          <div className="space-y-6">
            {product.tag && (
              <span className="inline-block rounded-sm bg-primary px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                {product.tag}
              </span>
            )}
            <h1 className="font-display text-2xl font-bold text-foreground md:text-4xl">
              {product.name}
            </h1>
            <p className="font-body text-2xl font-bold text-primary md:text-3xl">
              ${product.price}
            </p>
            <p className="font-body text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <ul className="space-y-1.5">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-sm text-foreground">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="font-body text-sm font-medium text-foreground">Quantity</span>
              {product.stock === 0 ? (
                <span className="font-body text-sm font-medium text-destructive">Out of stock</span>
              ) : (
                <div className="flex items-center rounded-sm border border-border">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:bg-secondary"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="flex h-9 w-10 items-center justify-center border-x border-border font-body text-sm font-medium">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(Math.min(maxQty, qty + 1))}
                    className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:bg-secondary"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Desktop CTA */}
            {product.stock > 0 ? (
              <Button
                onClick={handleOrder}
                size="lg"
                className="hidden w-full bg-primary font-body text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 md:flex"
              >
                Order This Bag — ${product.price * qty}
              </Button>
            ) : (
              <p className="hidden font-body text-sm text-muted-foreground md:block">Currently unavailable.</p>
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { icon: Truck, text: "Fast US Shipping" },
                { icon: Shield, text: "Secure Manual Checkout" },
                { icon: MessageCircle, text: "DM for Questions" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background p-3 md:hidden">
        {product.stock > 0 ? (
          <Button
            onClick={handleOrder}
            size="lg"
            className="w-full bg-primary font-body text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
          >
            Order This Bag — ${product.price * qty}
          </Button>
        ) : (
          <p className="py-2 text-center font-body text-sm text-muted-foreground">Currently unavailable.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
