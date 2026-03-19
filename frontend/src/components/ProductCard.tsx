import React from "react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  rating: number;
  reviews: number;
  image: string;
  recommended?: boolean;
  newArrival?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  description,
  price,
  size,
  rating,
  reviews,
  image,
  recommended,
  newArrival,
}) => {
  return (
    <div className="product-card group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt={name}
          src={image}
        />

        {recommended && (
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
              <span className="material-symbols-outlined text-xs">
                verified
              </span>{" "}
              Recommended
            </span>
          </div>
        )}
        {newArrival && (
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shadow-sm">
              New Arrival
            </span>
          </div>
        )}

        <div className="quick-add absolute inset-x-4 bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-primary transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">
              add_shopping_cart
            </span>{" "}
            Quick Add
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-1 text-primary mb-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="material-symbols-outlined text-sm fill-1">
              {i < Math.floor(rating)
                ? "star"
                : i < rating
                  ? "star_half"
                  : "star_border"}
            </span>
          ))}
          <span className="text-xs text-slate-400 font-medium ml-1">
            ({reviews})
          </span>
        </div>
        <h3 className="font-serif text-xl font-bold mb-1 text-slate-900">
          {name}
        </h3>
        <p className="text-sm text-slate-500 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900">
            ₹{price.toFixed(0)}
          </span>
          <span className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded uppercase">
            {size}
          </span>
        </div>
      </div>
    </div>
  );
};
