import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useUploadImage } from "@/hooks/useApi";
import { getApiUrl } from "@/lib/api";
import type { Product } from "@/data/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const TAG_OPTIONS: Array<Product["tag"]> = ["Best Seller", "Limited Stock", "New Arrival"];

function slugFromName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const emptyForm = (): Omit<Product, "id"> => ({
  slug: "",
  name: "",
  price: 0,
  description: "",
  features: [],
  images: [],
  stock: 0,
  tag: undefined,
});

const AdminProducts = () => {
  const { products: storeProducts, addProduct, updateProduct, deleteProduct } = useAppStore();
  const { data: apiProducts, isLoading } = useProducts();
  const products = getApiUrl() ? (apiProducts ?? []) : storeProducts;
  const createProduct = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const uploadImage = useUploadImage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyForm());
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const deleteProductIdRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      slug: p.slug,
      name: p.name,
      price: p.price,
      description: p.description,
      features: [...p.features],
      images: [...p.images],
      stock: p.stock,
      tag: p.tag,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const slug = form.slug.trim() || slugFromName(form.name);
    const price = Number(form.price);
    if (Number.isNaN(price) || price < 0) {
      toast.error("Valid price required");
      return;
    }
    const stock = Math.max(0, Math.floor(Number(form.stock) || 0));
    let images: string[] = typeof form.images === "string" ? (form.images as string).split("\n").map((s) => s.trim()).filter(Boolean) : [...(form.images || [])];
    if (getApiUrl()) {
      const toUpload = images.filter((url) => url.startsWith("data:"));
      for (const dataUrl of toUpload) {
        try {
          const res = await uploadImage.mutateAsync(dataUrl);
          images = images.map((url) => (url === dataUrl ? res.url : url));
        } catch {
          toast.error("Image upload failed");
          return;
        }
      }
    }
    const payload = {
      ...form,
      slug,
      name: form.name.trim(),
      price,
      description: form.description.trim(),
      features: typeof form.features === "string" ? (form.features as string).split("\n").map((s) => s.trim()).filter(Boolean) : form.features,
      images,
      stock,
      tag: form.tag || undefined,
    };

    if (getApiUrl()) {
      try {
        if (editingProduct) {
          await updateProductMutation.mutateAsync({ id: editingProduct.id, body: payload });
          toast.success("Product updated");
        } else {
          await createProduct.mutateAsync(payload);
          toast.success("Product added");
        }
        setDialogOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Save failed");
      }
      return;
    }
    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      toast.success("Product updated");
    } else {
      addProduct(payload);
      toast.success("Product added");
    }
    setDialogOpen(false);
  };

  const confirmDelete = (id: string) => {
    deleteProductIdRef.current = id;
    setDeleteProductId(id);
  };
  const handleDelete = async () => {
    const id = deleteProductIdRef.current;
    deleteProductIdRef.current = null;
    setDeleteProductId(null);
    if (!id) return;
    if (getApiUrl()) {
      try {
        await deleteProductMutation.mutateAsync(id);
        toast.success("Product removed");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Delete failed");
      }
      return;
    }
    deleteProduct(id);
    toast.success("Product removed");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const fileArray = Array.from(files);
    const maxSize = 3 * 1024 * 1024; // 3MB per file
    const validFiles = fileArray.filter((f) => {
      if (f.size > maxSize) {
        toast.error(`${f.name} is too large (max 3MB). Skipped.`);
        return false;
      }
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name} is not an image. Skipped.`);
        return false;
      }
      return true;
    });
    if (validFiles.length === 0) return;
    let read = 0;
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setForm((f) => ({ ...f, images: [...(f.images || []), dataUrl] }));
        read++;
        if (read === validFiles.length) {
          toast.success(`${validFiles.length} image(s) added`);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setForm((f) => ({
      ...f,
      images: (f.images || []).filter((_, i) => i !== index),
    }));
  };

  const formImages = Array.isArray(form.images) ? form.images : [];

  return (
    <div className="p-4 sm:p-6 pb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
          <p className="mt-1 font-body text-sm text-muted-foreground">{isLoading ? "Loading…" : `${products.length} bags in inventory`}</p>
        </div>
        <Button onClick={openAdd} className="gap-1.5 bg-primary font-body text-xs font-semibold text-primary-foreground">
          <Plus className="h-3.5 w-3.5" />
          Add New Bag
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">Product</th>
              <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">Tag</th>
              <th className="px-4 py-3 text-right font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center font-body text-sm text-muted-foreground"
                >
                  Loading…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center font-body text-sm text-muted-foreground"
                >
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border transition-colors hover:bg-secondary/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.length ? p.images[0] : "/placeholder.svg"}
                        alt={p.name}
                        className="h-10 w-10 rounded-sm object-cover"
                      />
                      <span className="font-body text-sm font-medium text-foreground">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-foreground">
                    ${p.price}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-foreground">
                    {p.stock}
                  </td>
                  <td className="px-4 py-3">
                    {p.tag ? (
                      <span className="rounded-sm bg-primary/10 px-2 py-0.5 font-body text-xs font-medium text-primary">
                        {p.tag}
                      </span>
                    ) : (
                      <span className="font-body text-xs text-muted-foreground">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="rounded-sm p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground touch-manipulation"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(p.id)}
                        className="rounded-sm p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive touch-manipulation"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="h-[100dvh] max-h-[100dvh] w-full rounded-none overflow-y-auto sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit bag" : "Add new bag"}</DialogTitle>
            <DialogDescription>{getApiUrl() ? "Saves update the live catalog." : "Changes are in-memory until you refresh."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Classic Tabby Shoulder 26"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="Leave empty to generate from name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step={1}
                  value={form.price || ""}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value === "" ? 0 : Number(e.target.value) }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tag">Tag</Label>
              <select
                id="tag"
                value={form.tag ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, tag: (e.target.value || undefined) as Product["tag"] }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 font-body text-sm"
              >
                <option value="">—</option>
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={Array.isArray(form.features) ? form.features.join("\n") : ""}
                onChange={(e) => setForm((f) => ({ ...f, features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) }))}
                rows={3}
                className="resize-none font-mono text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label>Product images</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload from device (computer or phone)
              </Button>
              <p className="font-body text-xs text-muted-foreground">
                JPG, PNG or WebP. Max 3MB per image. Works on mobile too.
              </p>
              {formImages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formImages.map((src, i) => (
                    <div key={i} className="relative">
                      <img
                        src={src}
                        alt=""
                        className="h-20 w-20 rounded-md border border-border object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingProduct ? "Save changes" : "Add bag"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteProductId} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this bag?</AlertDialogTitle>
            <AlertDialogDescription>This will remove the product from the catalog. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
