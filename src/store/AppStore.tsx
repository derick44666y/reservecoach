import { createContext, useContext, useMemo, useState, useCallback, useEffect, type ReactNode } from "react";
import { products as initialProducts } from "@/data/products";
import type { Product } from "@/data/products";
import type { OrderStatusType } from "@/components/OrderStatusBadge";

const STORAGE_KEY_PRODUCTS = "reserve_luxe_products";
const STORAGE_KEY_ORDERS = "reserve_luxe_orders";
const STORAGE_KEY_ORDER_COUNTER = "reserve_luxe_order_id_counter";

export interface Order {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  email: string;
  bag: string;
  qty: number;
  price: number;
  total: number;
  status: OrderStatusType;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  notes?: string;
}

function formatOrderDate() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed) && parsed.length >= 0) return parsed;
    }
  } catch {
    // ignore
  }
  return [...initialProducts];
}

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (raw) {
      const parsed = JSON.parse(raw) as Order[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

function loadOrderIdCounter(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDER_COUNTER);
    if (raw) {
      const n = parseInt(raw, 10);
      if (!Number.isNaN(n) && n >= 100) return n;
    }
  } catch {
    // ignore
  }
  return 100;
}

interface AppStoreValue {
  products: Product[];
  orders: Order[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  addOrder: (order: Omit<Order, "id" | "date">) => string;
  updateOrderStatus: (id: string, status: OrderStatusType) => void;
  getOrder: (id: string) => Order | undefined;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [orderIdCounter, setOrderIdCounter] = useState(loadOrderIdCounter);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDER_COUNTER, String(orderIdCounter));
  }, [orderIdCounter]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_PRODUCTS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as Product[];
          if (Array.isArray(parsed)) setProducts(parsed);
        } catch {
          // ignore
        }
      }
      if (e.key === STORAGE_KEY_ORDERS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as Order[];
          if (Array.isArray(parsed)) setOrders(parsed);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const getProductBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const addProduct = useCallback((product: Omit<Product, "id">) => {
    const id = String(Date.now());
    setProducts((prev) => [...prev, { ...product, id } as Product]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addOrder = useCallback((order: Omit<Order, "id" | "date">) => {
    const id = `RC-${String(orderIdCounter).padStart(5, "0")}`;
    setOrderIdCounter((c) => c + 1);
    setOrders((prev) => [
      { ...order, id, date: formatOrderDate() },
      ...prev,
    ]);
    return id;
  }, [orderIdCounter]);

  const updateOrderStatus = useCallback((id: string, status: OrderStatusType) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  }, []);

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  const value = useMemo<AppStoreValue>(
    () => ({
      products,
      orders,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductBySlug,
      getProductById,
      addOrder,
      updateOrderStatus,
      getOrder,
    }),
    [
      products,
      orders,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductBySlug,
      getProductById,
      addOrder,
      updateOrderStatus,
      getOrder,
    ]
  );

  return (
    <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
