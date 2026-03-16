import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getApiUrl } from "@/lib/api";
import type { Product } from "@/data/products";
import type { OrderStatusType } from "@/components/OrderStatusBadge";

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

const hasApi = () => !!getApiUrl();

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => api.get<Product[]>("/api/products"),
    enabled: hasApi(),
  });
}

export function useProductBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["products", slug],
    queryFn: () => api.get<Product>(`/api/products/${encodeURIComponent(slug!)}`),
    enabled: hasApi() && !!slug,
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get<Order[]>("/api/orders"),
    enabled: hasApi(),
  });
}

export function useOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => api.get<Order>(`/api/orders/${encodeURIComponent(orderId!)}`),
    enabled: hasApi() && !!orderId,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      customerName: string;
      phone: string;
      email: string;
      bag: string;
      qty: number;
      price: number;
      total: number;
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      notes?: string;
    }) => api.post<{ id: string }>("/api/orders", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatusType }) =>
      api.patch<Order>(`/api/orders/${encodeURIComponent(orderId)}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<Product, "id">) => api.post<Product>("/api/products", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Omit<Product, "id">> }) =>
      api.put<Product>(`/api/products/${encodeURIComponent(id)}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/products/${encodeURIComponent(id)}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (image: string) => api.post<{ url: string }>("/api/upload", { image }),
  });
}
