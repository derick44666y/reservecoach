import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppStoreProvider } from "./store/AppStore";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import OrderForm from "./pages/OrderForm";
import OrderSuccess from "./pages/OrderSuccess";
import OrderStatus from "./pages/OrderStatus";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AppStoreProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bags/:slug" element={<ProductDetail />} />
          <Route path="/order/:slug" element={<OrderForm />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/order-status/:orderId" element={<OrderStatus />} />
          
          {/* Admin */}
          <Route path="/vault/login" element={<AdminLogin />} />
          <Route path="/vault" element={<AdminLayout />}>
            <Route index element={<Navigate to="/vault/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
        </TooltipProvider>
      </AppStoreProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
