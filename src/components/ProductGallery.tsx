import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

const PLACEHOLDER_IMAGE = "/placeholder.svg";

const ProductGallery = ({ images, name }: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hasImages = images.length > 0;
  const displayImages = hasImages ? images : [PLACEHOLDER_IMAGE];
  const currentImage = displayImages[selectedIndex] ?? PLACEHOLDER_IMAGE;

  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-sm bg-secondary">
        <img
          src={currentImage}
          alt={hasImages ? `${name} - view ${selectedIndex + 1}` : name}
          className="h-full w-full object-cover"
        />
      </div>
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-colors ${
                i === selectedIndex ? "border-primary" : "border-transparent"
              }`}
            >
              <img
                src={img}
                alt={hasImages ? `${name} thumbnail ${i + 1}` : name}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
