import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/bags/${product.slug}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-sm bg-secondary">
          <img
            src={product.images?.length ? product.images[0] : "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {product.tag && (
            <span className="absolute left-2 top-2 rounded-sm bg-primary px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              {product.tag}
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-display text-sm font-medium leading-tight text-foreground md:text-base">
            {product.name}
          </h3>
          <p className="font-body text-lg font-semibold text-primary">
            ${product.price}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
