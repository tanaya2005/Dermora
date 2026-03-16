import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type Product = {
  id: number;
  name: string;
  desc: string;
  price: string;
  size: string;
  rating: number;
  tag?: string;
  img: string;
};

const savedItems: Product[] = [
  {
    id: 1,
    name: 'Hyaluronic Radiance Serum',
    desc: 'Deep hydration for glowing skin',
    price: '$64.00',
    size: '30ml',
    rating: 5,
    tag: 'Saved',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCthtV7EGAbCv3I6VI4zQgd7RdM_6jnCTqKQoBLSC0pRnEQA3BBE9Lr0jvndTbWlP5XP8bqDN8Y0c7A80ER7RHMQM8ghSsS0yGJFROxyKy6y9hMKhSXk_MnWyb8WhtzMTkYhFpG9pBjNqkwtbh3nrMlv9jrik9eudLf0_kggNVXGJPtuaLVl2RIp8Tnbv8FqKTPd0OdDVusXQInDDj-jY9vq1PIIs7xWBNonJ5o5CZdbo1odtHJ5p8GIAnz7Jb6gbxjOQFcslvUOv0',
  },
  {
    id: 2,
    name: 'Ceramide Night Mask',
    desc: 'Intensive overnight skin repair',
    price: '$55.00',
    size: '50ml',
    rating: 4.5,
    tag: 'Saved',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeuxcTPXm1Wu6rl8Z1E_k5yGRnmkzy5TfnakQG3SG5gf5kcPHBVv066jLtoTw5JcyiB6WFygrUJfj7fX-zZnZJ3AViydoyxEfFTzP2QnvOdRIt2o7OybKyycs8SjL1263yRuwyerjI-9-p-vi61PgNS8x7kqcHGdpRKE_EjlAcIjVPxmPj3UF7etELvLiYJ6vPw8lJMZ55X9bDOnKhSM4E4gcePKZqF03bzA6orApfDea69oxUOoP7FdB9LlScaLSUtJEMi1ayzs',
  },
];

const recommendedItems: Product[] = [
  {
    id: 3,
    name: 'Bakuchiol Night Elixir',
    desc: 'Plant-based retinol alternative for sensitive skin',
    price: '$72.00',
    size: '15ml',
    rating: 5,
    tag: 'AI Pick',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfRgEj25AwwhL50pzUXi5VvU-PfXSDkk0N43L9UaocW3rkzvmFkNlO3_3m1yAUDEd6brghO0QT1xmyn5nty5WdQ8pjYl9cbAKdK7-pQ_k2t1k7Y8KQru600F04WWHO5s1H4KM9nDwbD-l57TkqCIJ0OqtKvUPJa3tcDrUzVCkiFJ_Yq7oqsE_4gFGhRmnBDeWj_T3W6HPmX-ZH9RLshrZpIfnRXPpuUMwB58Kd5RNzbU2iX3JGBEXcfvm4RP5KQvfsJh6waLA_1sA',
  },
  {
    id: 4,
    name: 'Barrier Recovery Cream',
    desc: 'Restores and calms sensitive skin',
    price: '$48.00',
    size: '50ml',
    rating: 4.5,
    tag: 'AI Pick',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-czFQDQ8BkT0vco4oouyE-WhN_AKk91TdpnOt27xztKo--dPOwHEVHScKu3Phex1mdbs5XQq84MNqOHzaEdM7xkPvDyIzIGSNsqeS3GSvrkrF8EwOblTvyFYcqEtgvRNaU2cJjEuhiuMh7xST25fdbq8Hx6LX1FNqDv4Fdpw0-u2mE_eiHFVY1RSbGi3hDYJf8x3AdynT8eNQfHWBZ8ovvtt3p58Exm1F2DQLG8g148OY4XMcGA4qiv4hh1nJVt6NMLZ1a-JppPc',
  },
  {
    id: 5,
    name: 'Oat Amino Acid Cleanser',
    desc: 'Gentle daily impurities removal',
    price: '$32.00',
    size: '120ml',
    rating: 5,
    tag: 'AI Pick',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAC95BRCsZwOHYcl3sQaPxnqZUkR8FxNG3vEWmY2HzY_751XFCjJ5FbL58umhgEZtfR47ANmm4nPzfrh_nYCpalk6hYwjMPBLygpkjpJs7PzmFBFkEJN-W8Nit510NPO-Lm8VvxSjObilAL568PrON_ie6BY80D292Xh9Y_ZdNR662DjZNWsQM17D2-n4GQVgni-tkT_oqTus5JjPDQFZtDxarjhCLnuADj-7dN8UxI8b2L6HQsqHUtfM_C6_2EN16ON0vnCK0eMQ',
  },
  {
    id: 6,
    name: 'Rose Water Hydrating Mist',
    desc: 'Instant refresh and pH balance',
    price: '$28.00',
    size: '100ml',
    rating: 4,
    tag: 'AI Pick',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFOmtdtymPiQLcQjzpkQwx4sFq8LKHhtjE1Gk0-TN9xUXv_xrUJD6LslcqvBtr9m9ExoehrStlOUq5grmORHCTb47ilfYcjMxECqRZOIQZgEGK9abzySJTJquXtn3gOKuNFB0h8ZMbI54RNuqacJkg025CWQJwkuPOxjZWGMyBs6nvcxkF4M0mj32TGywug5jCcM0bSEX616tg_tjclvsB4gCaz_iKM9XZBgMeiMQAO-D1JCezG7Zo0ePsMPcW-wxHpI6975Xq2mw',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-primary">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className="material-symbols-outlined text-sm">
          {i <= Math.floor(rating) ? 'star' : rating % 1 >= 0.5 && i === Math.ceil(rating) ? 'star_half' : 'star_border'}
        </span>
      ))}
    </div>
  );
}

// card: white on light bg → dark text | slate-700 on dark bg → light text
const cardCls = 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm';

function ProductCard({ product, onRemove, isSaved }: { product: Product; onRemove?: (id: number) => void; isSaved?: boolean }) {
  return (
    <div className={`group overflow-hidden hover:shadow-xl transition-all duration-300 ${cardCls}`}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-600">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Tag badge */}
        {product.tag && (
          <div className="absolute top-3 left-3">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md ${
              product.tag === 'AI Pick' ? 'bg-violet-500 text-white' : 'bg-primary text-white'
            }`}>
              <span className="material-symbols-outlined text-xs">
                {product.tag === 'AI Pick' ? 'auto_awesome' : 'favorite'}
              </span>
              {product.tag}
            </span>
          </div>
        )}
        {/* Remove button (saved items) */}
        {isSaved && onRemove && (
          <button
            onClick={() => onRemove(product.id)}
            className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-slate-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-rose-50 dark:hover:bg-rose-900/40"
          >
            <span className="material-symbols-outlined text-sm text-rose-400">close</span>
          </button>
        )}
      </div>

      {/* Text content — bg is white (light) or slate-700 (dark), so text needs to flip */}
      <div className="p-4">
        <StarRating rating={product.rating} />
        {/* Light card → dark text | dark card → white text */}
        <h3 className="font-serif font-bold text-slate-900 dark:text-white text-sm leading-snug mt-1 mb-0.5">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-300 mb-3">{product.desc}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-slate-900 dark:text-white">{product.price}</span>
          <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded uppercase">{product.size}</span>
        </div>
        <button className="w-full bg-primary/10 hover:bg-primary hover:text-white text-primary font-bold text-xs py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export const MyListPage: React.FC = () => {
  const [saved, setSaved] = useState<Product[]>(savedItems);
  const [activeTab, setActiveTab] = useState<'saved' | 'recommended'>('saved');

  const removeSaved = (id: number) => setSaved(prev => prev.filter(p => p.id !== id));

  return (
    <div className="w-full">
      <main className="max-w-6xl mx-auto w-full px-6 md:px-10 py-10">

        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-3">
            <Link className="hover:text-primary transition-colors" to="/">Home</Link>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary font-medium">My List</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">My List</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Your saved favourites &amp; AI-curated picks.</p>
            </div>
            <Link
              to="/assessment"
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-500 text-white rounded-xl text-sm font-bold shadow-md shadow-violet-400/20 hover:opacity-90 transition-opacity self-start md:self-auto"
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Refresh AI Picks
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-1 w-fit mb-8">
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">favorite</span>
              Saved ({saved.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'recommended'
                ? 'bg-violet-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              AI Recommended ({recommendedItems.length})
            </span>
          </button>
        </div>

        {/* Saved tab */}
        {activeTab === 'saved' && (
          <>
            {saved.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 gap-6 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary">favorite_border</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">No saved items yet</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Tap the heart on any product to save it here.</p>
                </div>
                <Link to="/products" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {saved.map(p => (
                  <ProductCard key={p.id} product={p} onRemove={removeSaved} isSaved />
                ))}
              </div>
            )}
          </>
        )}

        {/* AI Recommended tab */}
        {activeTab === 'recommended' && (
          <div>
            {/* AI Banner */}
            <div className="bg-white dark:bg-slate-700 border border-violet-200 dark:border-violet-700/50 rounded-2xl p-5 mb-7 flex items-center gap-4">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-violet-500 flex items-center justify-center shadow-md shadow-violet-400/20">
                <span className="material-symbols-outlined text-white text-2xl">auto_awesome</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Personalised for your skin type</p>
                <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                  Based on your{' '}
                  <Link to="/assessment" className="text-primary hover:underline font-semibold">skin assessment</Link>.
                  Take it again to get fresh picks!
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedItems.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyListPage;
