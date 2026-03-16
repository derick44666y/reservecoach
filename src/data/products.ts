import bagTabby from "@/assets/bag-tabby-signature.jpg";
import bagQuilted from "@/assets/bag-quilted-crossbody.jpg";
import bagCream from "@/assets/bag-cream-tote.jpg";
import bagBurgundy from "@/assets/bag-burgundy-shoulder.jpg";
import bagOlive from "@/assets/bag-olive-saddle.jpg";
import bagBlush from "@/assets/bag-blush-flap.jpg";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  images: string[];
  stock: number;
  tag?: "Best Seller" | "Limited Stock" | "New Arrival";
}

export const products: Product[] = [
  {
    id: "1",
    slug: "classic-tabby-shoulder-26",
    name: "Classic Tabby Shoulder 26",
    price: 298,
    description: "Signature canvas with premium leather trim and polished gold-tone hardware. The iconic structured silhouette with a modern edge.",
    features: [
      "Signature coated canvas with leather trim",
      "Gold-tone hardware",
      "Interior zip & slip pockets",
      'Dimensions: 10.25" (L) x 6.75" (H) x 3.5" (W)',
      "Adjustable shoulder strap",
      "Mirror quality construction",
    ],
    images: [bagTabby, bagTabby, bagTabby],
    stock: 8,
    tag: "Best Seller",
  },
  {
    id: "2",
    slug: "quilted-madison-crossbody",
    name: "Quilted Madison Crossbody",
    price: 345,
    description: "Luxe quilted lambskin leather with a woven gold chain strap. Compact yet spacious enough for all your essentials.",
    features: [
      "Genuine quilted lambskin leather",
      "Gold chain with leather weave strap",
      "Magnetic snap closure",
      'Dimensions: 8" (L) x 5.5" (H) x 3" (W)',
      "Interior card slots",
      "Authentic hardware finish",
    ],
    images: [bagQuilted, bagQuilted, bagQuilted],
    stock: 5,
    tag: "Limited Stock",
  },
  {
    id: "3",
    slug: "grace-structured-tote",
    name: "Grace Structured Tote",
    price: 425,
    description: "Elegant ivory pebbled leather tote with a structured silhouette and gold turnlock. The perfect everyday luxury piece.",
    features: [
      "Premium pebbled calfskin leather",
      "Gold-tone turnlock closure",
      "Dual top handles with 5\" drop",
      'Dimensions: 12" (L) x 9.5" (H) x 5" (W)',
      "Protective metal feet",
      "Suede-lined interior",
    ],
    images: [bagCream, bagCream, bagCream],
    stock: 4,
    tag: "New Arrival",
  },
  {
    id: "4",
    slug: "audrey-top-handle-satchel",
    name: "Audrey Top Handle Satchel",
    price: 378,
    description: "Rich burgundy smooth leather with a structured frame and gold push-lock. Old-money elegance meets modern function.",
    features: [
      "Smooth calfskin leather",
      "Gold push-lock closure",
      "Detachable crossbody strap",
      'Dimensions: 9.5" (L) x 7" (H) x 4.5" (W)',
      "Interior divider pocket",
      "Dust bag included",
    ],
    images: [bagBurgundy, bagBurgundy, bagBurgundy],
    stock: 6,
  },
  {
    id: "5",
    slug: "mini-saddle-crossbody",
    name: "Mini Saddle Crossbody",
    price: 265,
    description: "Compact olive green saddle bag with gold turnlock detail. Perfect for running errands or a night out.",
    features: [
      "Smooth leather construction",
      "Gold turnlock closure",
      "Adjustable crossbody strap",
      'Dimensions: 7" (L) x 6" (H) x 2.5" (W)',
      "Back slip pocket",
      "Compact & lightweight",
    ],
    images: [bagOlive, bagOlive, bagOlive],
    stock: 12,
  },
  {
    id: "6",
    slug: "crystal-bloom-mini-flap",
    name: "Crystal Bloom Mini Flap",
    price: 398,
    description: "Soft blush pink leather with a crystal-embellished buckle and gold chain. Statement-making femininity.",
    features: [
      "Soft nappa leather",
      "Crystal-embellished gold buckle",
      "Gold chain strap",
      'Dimensions: 7.5" (L) x 5" (H) x 2.5" (W)',
      "Magnetic flap closure",
      "Satin-lined interior",
    ],
    images: [bagBlush, bagBlush, bagBlush],
    stock: 3,
    tag: "Limited Stock",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
