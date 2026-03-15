import React from "react";

import { Footer } from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { FilterSidebar } from "../components/FilterSidebar";
import { Link } from "react-router-dom";

const products = [
  {
    id: "1",
    name: "Hyaluronic Radiance Serum",
    description: "Deep hydration for glowing skin",
    price: 64.0,
    size: "30ml",
    rating: 4.5,
    reviews: 124,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCthtV7EGAbCv3I6VI4zQgd7RdM_6jnCTqKQoBLSC0pRnEQA3BBE9Lr0jvndTbWlP5XP8bqDN8Y0c7A80ER7RHMQM8ghSsS0yGJFROxyKy6y9hMKhSXk_MnWyb8WhtzMTkYhFpG9pBjNqkwtbh3nrMlv9jrik9eudLf0_kggNVXGJPtuaLVl2RIp8Tnbv8FqKTPd0OdDVusXQInDDj-jY9vq1PIIs7xWBNonJ5o5CZdbo1odtHJ5p8GIAnz7Jb6gbxjOQFcslvUOv0",
    recommended: true,
    newArrival: false,
  },
  {
    id: "2",
    name: "Barrier Recovery Cream",
    description: "Restores and calms sensitive skin",
    price: 48.0,
    size: "50ml",
    rating: 4.8,
    reviews: 89,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC-czFQDQ8BkT0vco4oouyE-WhN_AKk91TdpnOt27xztKo--dPOwHEVHScKu3Phex1mdbs5XQq84MNqOHzaEdM7xkPvDyIzIGSNsqeS3GSvrkrF8EwOblTvyFYcqEtgvRNaU2cJjEuhiuMh7xST25fdbq8Hx6LX1FNqDv4Fdpw0-u2mE_eiHFVY1RSbGi3hDYJf8x3AdynT8eNQfHWBZ8ovvtt3p58Exm1F2DQLG8g148OY4XMcGA4qiv4hh1nJVt6NMLZ1a-JppPc",
    recommended: false,
    newArrival: true,
  },
  {
    id: "3",
    name: "Bakuchiol Night Elixir",
    description: "Plant-based retinol alternative",
    price: 72.0,
    size: "15ml",
    rating: 5.0,
    reviews: 215,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAfRgEj25AwwhL50pzUXi5VvU-PfXSDkk0N43L9UaocW3rkzvmFkNlO3_3m1yAUDEd6brghO0QT1xmyn5nty5WdQ8pjYl9cbAKdK7-pQ_k2t1k7Y8KQru600F04WWHO5s1H4KM9nDwbD-l57TkqCIJ0OqtKvUPJa3tcDrUzVCkiFJ_Yq7oqsE_4gFGhRmnBDeWj_T3W6HPmX-ZH9RLshrZpIfnRXPpuUMwB58Kd5RNzbU2iX3JGBEXcfvm4RP5KQvfsJh6waLA_1sA",
    recommended: true,
    newArrival: false,
  },
  {
    id: "4",
    name: "Rose Water Hydrating Mist",
    description: "Instant refresh and pH balance",
    price: 28.0,
    size: "100ml",
    rating: 4.2,
    reviews: 42,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDFOmtdtymPiQLcQjzpkQwx4sFq8LKHhtjE1Gk0-TN9xUXv_xrUJD6LslcqvBtr9m9ExoehrStlOUq5grmORHCTb47ilfYcjMxECqRZOIQZgEGK9abzySJTJquXtn3gOKuNFB0h8ZMbI54RNuqacJkg025CWQJwkuPOxjZWGMyBs6nvcxkF4M0mj32TGywug5jCcM0bSEX616tg_tjclvsB4gCaz_iKM9XZBgMeiMQAO-D1JCezG7Zo0ePsMPcW-wxHpI6975Xq2mw",
    recommended: false,
    newArrival: false,
  },
  {
    id: "5",
    name: "Oat Amino Acid Cleanser",
    description: "Gentle daily impurities removal",
    price: 32.0,
    size: "120ml",
    rating: 5.0,
    reviews: 156,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAC95BRCsZwOHYcl3sQaPxnqZUkR8FxNG3vEWmY2HzY_751XFCjJ5FbL58umhgEZtfR47ANmm4nPzfrh_nYCpalk6hYwjMPBLygpkjpJs7PzmFBFkEJN-W8Nit510NPO-Lm8VvxSjObilAL568PrON_ie6BY80D292Xh9Y_ZdNR662DjZNWsQM17D2-n4GQVgni-tkT_oqTus5JjPDQFZtDxarjhCLnuADj-7dN8UxI8b2L6HQsqHUtfM_C6_2EN16ON0vnCK0eMQ",
    recommended: true,
    newArrival: false,
  },
  {
    id: "6",
    name: "Ceramide Night Mask",
    description: "Intensive overnight repair",
    price: 55.0,
    size: "50ml",
    rating: 4.6,
    reviews: 53,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBoeuxcTPXm1Wu6rl8Z1E_k5yGRnmkzy5TfnakQG3SG5gf5kcPHBVv066jLtoTw5JcyiB6WFygrUJfj7fX-zZnZJ3AViydoyxEfFTzP2QnvOdRIt2o7OybKyycs8SjL1263yRuwyerjI-9-p-vi61PgNS8x7kqcHGdpRKE_EjlAcIjVPxmPj3UF7etELvLiYJ6vPw8lJMZ55X9bDOnKhSM4E4gcePKZqF03bzA6orApfDea69oxUOoP7FdB9LlScaLSUtJEMi1ayzs",
    recommended: false,
    newArrival: false,
  },
];

export const ProductListingPage: React.FC = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-black">
      <main className="max-w-7xl mx-auto w-full px-6 md:px-10 py-8 flex flex-col md:flex-row gap-8">
        <FilterSidebar />
        <div className="flex-1">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <Link className="hover:text-primary" to="/">
                  Home
                </Link>
                <span className="material-symbols-outlined text-[10px]">
                  chevron_right
                </span>
                <span className="text-primary font-medium">Skincare</span>
              </nav>
              <h1 className="text-4xl font-serif font-bold text-slate-900">
                Recommended For You
              </h1>
              <p className="text-slate-500 mt-2">
                Discover products backed by science and dermatologists.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-slate-500">Sort by:</p>
              <select className="bg-white border-primary/10 rounded-lg text-sm px-4 py-2 focus:ring-primary focus:border-primary shadow-sm dark:bg-slate-800 dark:text-white">
                <option>Featured</option>
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link to={`/products/${product.id}`} key={product.id}>
                <ProductCard {...product} />
              </Link>
            ))}
          </div>

          <div className="mt-16 flex items-center justify-center gap-4">
            <button className="size-10 flex items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="size-10 flex items-center justify-center rounded-full bg-primary text-white font-bold">
                1
              </span>
              <span className="size-10 flex items-center justify-center rounded-full hover:bg-primary/10 cursor-pointer font-medium">
                2
              </span>
              <span className="size-10 flex items-center justify-center rounded-full hover:bg-primary/10 cursor-pointer font-medium">
                3
              </span>
            </div>
            <button className="size-10 flex items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
