import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import SiteHeader from "@/components/SiteHeader";
import { useAppStore } from "@/store/AppStore";
import { useProducts } from "@/hooks/useApi";
import { getApiUrl } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const TAG_FILTER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "All bags" },
  { value: "Best Seller", label: "Best Seller" },
  { value: "Limited Stock", label: "Limited Stock" },
  { value: "New Arrival", label: "New Arrival" },
];

const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const Index = () => {
  const { products: storeProducts } = useAppStore();
  const { data: apiProducts, isLoading, isError } = useProducts();
  const products = getApiUrl() ? (apiProducts ?? []) : storeProducts;
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sort, setSort] = useState("default");

  const filteredProducts = useMemo(() => {
    let list = products;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.tag && p.tag.toLowerCase().includes(q))
      );
    }
    if (tagFilter) {
      list = list.filter((p) => p.tag === tagFilter);
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, search, tagFilter, sort]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-6 md:py-10">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            The Collection
          </h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Curated luxury — limited quantities
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <div className="relative max-w-md flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 font-body"
              aria-label="Search for a bag"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 font-body text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filter by tag"
            >
              {TAG_FILTER_OPTIONS.map((o) => (
                <option key={o.value || "all"} value={o.value}>{o.label}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 font-body text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Sort by"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-6">
          {isLoading ? (
            <div className="col-span-full py-12 text-center font-body text-muted-foreground">Loading…</div>
          ) : isError ? (
            <div className="col-span-full py-12 text-center font-body text-muted-foreground">Unable to load products.</div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center font-body text-muted-foreground">
              {search.trim() ? `No bags match "${search}". Try another search.` : "No bags in the collection yet."}
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </main>
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <a href="mailto:hello@reservecoach.com" className="font-body text-xs text-muted-foreground hover:text-foreground underline">
            Contact
          </a>
          <a href="#privacy" className="font-body text-xs text-muted-foreground hover:text-foreground underline">
            Privacy
          </a>
          <a href="#terms" className="font-body text-xs text-muted-foreground hover:text-foreground underline">
            Terms
          </a>
        </div>
        <p className="mt-4 text-center font-body text-xs text-muted-foreground">
          © 2026 Reserve Coach · US-Based · All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default Index;
