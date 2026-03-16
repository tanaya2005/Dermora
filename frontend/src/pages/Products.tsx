import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

const products = [
  { id: 1, name: 'Hyaluronic Radiance Serum', desc: 'Deep hydration for glowing skin', price: '$64.00', size: '30ml', rating: 5, reviews: 124, badge: 'Recommended', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCthtV7EGAbCv3I6VI4zQgd7RdM_6jnCTqKQoBLSC0pRnEQA3BBE9Lr0jvndTbWlP5XP8bqDN8Y0c7A80ER7RHMQM8ghSsS0yGJFROxyKy6y9hMKhSXk_MnWyb8WhtzMTkYhFpG9pBjNqkwtbh3nrMlv9jrik9eudLf0_kggNVXGJPtuaLVl2RIp8Tnbv8FqKTPd0OdDVusXQInDDj-jY9vq1PIIs7xWBNonJ5o5CZdbo1odtHJ5p8GIAnz7Jb6gbxjOQFcslvUOv0' },
  { id: 2, name: 'Barrier Recovery Cream', desc: 'Restores and calms sensitive skin', price: '$48.00', size: '50ml', rating: 4.5, reviews: 89, badge: 'New Arrival', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-czFQDQ8BkT0vco4oouyE-WhN_AKk91TdpnOt27xztKo--dPOwHEVHScKu3Phex1mdbs5XQq84MNqOHzaEdM7xkPvDyIzIGSNsqeS3GSvrkrF8EwOblTvyFYcqEtgvRNaU2cJjEuhiuMh7xST25fdbq8Hx6LX1FNqDv4Fdpw0-u2mE_eiHFVY1RSbGi3hDYJf8x3AdynT8eNQfHWBZ8ovvtt3p58Exm1F2DQLG8g148OY4XMcGA4qiv4hh1nJVt6NMLZ1a-JppPc' },
  { id: 3, name: 'Bakuchiol Night Elixir', desc: 'Plant-based retinol alternative', price: '$72.00', size: '15ml', rating: 5, reviews: 215, badge: 'Recommended', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfRgEj25AwwhL50pzUXi5VvU-PfXSDkk0N43L9UaocW3rkzvmFkNlO3_3m1yAUDEd6brghO0QT1xmyn5nty5WdQ8pjYl9cbAKdK7-pQ_k2t1k7Y8KQru600F04WWHO5s1H4KM9nDwbD-l57TkqCIJ0OqtKvUPJa3tcDrUzVCkiFJ_Yq7oqsE_4gFGhRmnBDeWj_T3W6HPmX-ZH9RLshrZpIfnRXPpuUMwB58Kd5RNzbU2iX3JGBEXcfvm4RP5KQvfsJh6waLA_1sA' },
  { id: 4, name: 'Rose Water Hydrating Mist', desc: 'Instant refresh and pH balance', price: '$28.00', size: '100ml', rating: 4, reviews: 42, badge: '', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFOmtdtymPiQLcQjzpkQwx4sFq8LKHhtjE1Gk0-TN9xUXv_xrUJD6LslcqvBtr9m9ExoehrStlOUq5grmORHCTb47ilfYcjMxECqRZOIQZgEGK9abzySJTJquXtn3gOKuNFB0h8ZMbI54RNuqacJkg025CWQJwkuPOxjZWGMyBs6nvcxkF4M0mj32TGywug5jCcM0bSEX616tg_tjclvsB4gCaz_iKM9XZBgMeiMQAO-D1JCezG7Zo0ePsMPcW-wxHpI6975Xq2mw' },
  { id: 5, name: 'Oat Amino Acid Cleanser', desc: 'Gentle daily impurities removal', price: '$32.00', size: '120ml', rating: 5, reviews: 156, badge: 'Recommended', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAC95BRCsZwOHYcl3sQaPxnqZUkR8FxNG3vEWmY2HzY_751XFCjJ5FbL58umhgEZtfR47ANmm4nPzfrh_nYCpalk6hYwjMPBLygpkjpJs7PzmFBFkEJN-W8Nit510NPO-Lm8VvxSjObilAL568PrON_ie6BY80D292Xh9Y_ZdNR662DjZNWsQM17D2-n4GQVgni-tkT_oqTus5JjPDQFZtDxarjhCLnuADj-7dN8UxI8b2L6HQsqHUtfM_C6_2EN16ON0vnCK0eMQ' },
  { id: 6, name: 'Ceramide Night Mask', desc: 'Intensive overnight repair', price: '$55.00', size: '50ml', rating: 4.5, reviews: 53, badge: '', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeuxcTPXm1Wu6rl8Z1E_k5yGRnmkzy5TfnakQG3SG5gf5kcPHBVv066jLtoTw5JcyiB6WFygrUJfj7fX-zZnZJ3AViydoyxEfFTzP2QnvOdRIt2o7OybKyycs8SjL1263yRuwyerjI-9-p-vi61PgNS8x7kqcHGdpRKE_EjlAcIjVPxmPj3UF7etELvLiYJ6vPw8lJMZ55X9bDOnKhSM4E4gcePKZqF03bzA6orApfDea69oxUOoP7FdB9LlScaLSUtJEMi1ayzs' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-primary">
      {[1,2,3,4,5].map(i => (
        <span key={i} className="material-symbols-outlined text-sm">
          {i <= Math.floor(rating) ? 'star' : rating % 1 >= 0.5 && i === Math.ceil(rating) ? 'star_half' : 'star'}
        </span>
      ))}
    </div>
  );
}

export default function Products() {
  return (
    <div className="w-full">
      <main className="max-w-7xl mx-auto w-full px-6 md:px-10 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-28 flex flex-col gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">filter_list</span> Filters
              </h3>
              <div className="flex flex-col gap-6 custom-scrollbar">
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-bold uppercase tracking-wider text-primary/70">Skin Type</p>
                  <div className="flex flex-col gap-2">
                    {['Oily Skin','Dry Skin','Sensitive Skin','Combination'].map((t, i) => (
                      <label key={t} className="flex items-center gap-2 text-sm cursor-pointer group">
                        <input defaultChecked={i===2} className="rounded border-primary/30 text-primary focus:ring-primary" type="checkbox" />
                        <span className="group-hover:text-primary transition-colors">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-bold uppercase tracking-wider text-primary/70">Concerns</p>
                  <div className="flex flex-col gap-2">
                    {['Anti-Aging','Acne & Blemishes','Hyperpigmentation'].map(t => (
                      <label key={t} className="flex items-center gap-2 text-sm cursor-pointer group">
                        <input className="rounded border-primary/30 text-primary focus:ring-primary" type="checkbox" />
                        <span className="group-hover:text-primary transition-colors">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-bold uppercase tracking-wider text-primary/70">Price Range</p>
                  <input className="w-full accent-primary bg-primary/20 rounded-lg h-1.5 cursor-pointer" type="range" />
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>$0</span><span>$200+</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-primary/10">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 cursor-pointer group transition-all hover:bg-primary/10">
                    <input defaultChecked className="rounded-full border-primary/30 text-primary focus:ring-primary" type="checkbox" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">Derm Recommended</span>
                      <span className="text-[10px] text-primary">Clinically Proven Results</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <Link className="hover:text-primary" to="/">Home</Link>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-primary font-medium">Skincare</span>
              </nav>
              <h1 className="text-4xl font-serif font-bold text-slate-900">Recommended For You</h1>
              <p className="text-slate-500 mt-2">Discover products backed by science and dermatologists.</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-slate-500">Sort by:</p>
              <select className="bg-white border-primary/10 rounded-lg text-sm px-4 py-2 focus:ring-primary focus:border-primary shadow-sm">
                <option>Featured</option>
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(p => (
              <div key={p.id} className="product-card group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
                  <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={p.img} alt={p.name} />
                  {p.badge === 'Recommended' && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <span className="material-symbols-outlined text-xs">verified</span> Recommended
                      </span>
                    </div>
                  )}
                  {p.badge === 'New Arrival' && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shadow-sm">New Arrival</span>
                    </div>
                  )}
                  <div className="quick-add absolute inset-x-4 bottom-4">
                    <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-primary transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-lg">add_shopping_cart</span> Quick Add
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <StarRating rating={p.rating} />
                  <span className="text-xs text-slate-400 font-medium ml-1">({p.reviews})</span>
                  <h3 className="font-serif text-xl font-bold mb-1 text-slate-900 mt-2">{p.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">{p.price}</span>
                    <span className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded uppercase">{p.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex items-center justify-center gap-4">
            <button className="size-10 flex items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="size-10 flex items-center justify-center rounded-full bg-primary text-white font-bold">1</span>
              <span className="size-10 flex items-center justify-center rounded-full hover:bg-primary/10 cursor-pointer font-medium">2</span>
              <span className="size-10 flex items-center justify-center rounded-full hover:bg-primary/10 cursor-pointer font-medium">3</span>
            </div>
            <button className="size-10 flex items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
