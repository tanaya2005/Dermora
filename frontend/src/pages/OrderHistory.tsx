import { Link } from 'react-router-dom';
import { DermoraLogo } from '../components/Logo';
const orders = [
  {
    id: 'DM-98231', date: 'Oct 14, 2023', status: 'Delivered',
    statusClass: 'bg-soft-olive text-accent-green', statusIcon: 'check_circle',
    name: 'The Glow Kit Bundle', desc: 'Includes: Vitamin C Serum, Hyaluronic Acid, Face Oil',
    price: '$124.00', feedbackSent: false,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJX1MvkhOFBbFkSik8VqNaAYLE-UNz_hq_QPKN8s_PxBKz3L9RtcDSEyW8fq0oR-XPKTkV81zJXpYHVEi7Lui6VByEpm2yRdyHeAEHaZKANXzrigr6g9NR19fqaa_QzSVtyho1sG',
  },
  {
    id: 'DM-99042', date: 'Nov 02, 2023', status: 'In Transit',
    statusClass: 'bg-primary/10 text-primary', statusIcon: 'local_shipping',
    name: 'Deep Hydration Overnight Cream', desc: 'Quantity: 2 x 50ml',
    price: '$78.00', feedbackSent: false, delivery: 'Nov 08, 2023', progress: '65%',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-czFQDQ8BkT0vco4oouyE-WhN_AKk91TdpnOt27xztKo--dPOwHEVHScKu3Phex1mdbs5XQq84MNqOHzaEdM7xkPvDyIzIGSNsqeS3GSvrkrF8EwOblTvyFYcqEtgvRNaU2cJjEuhiuMh7xST25fdbq8Hx6LX1FNqDv4Fdpw0-u2mE_eiHFVY1RSbGi3hDYJf8x3AdynT8eNQfHWBZ8ovvtt3p58Exm1F2DQLG8g148OY4XMcGA4qiv4hh1nJVt6NMLZ1a-JppPc',
  },
  {
    id: 'DM-94109', date: 'Sep 12, 2023', status: 'Delivered',
    statusClass: 'bg-soft-olive text-accent-green', statusIcon: 'check_circle',
    name: 'Pore Purifying Mask', desc: 'Size: 100g Standard',
    price: '$42.00', feedbackSent: true,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfRgEj25AwwhL50pzUXi5VvU-PfXSDkk0N43L9UaocW3rkzvmFkNlO3_3m1yAUDEd6brghO0QT1xmyn5nty5WdQ8pjYl9cbAKdK7-pQ_k2t1k7Y8KQru600F04WWHO5s1H4KM9nDwbD-l57TkqCIJ0OqtKvUPJa3tcDrUzVCkiFJ_Yq7oqsE_4gFGhRmnBDeWj_T3W6HPmX-ZH9RLshrZpIfnRXPpuUMwB58Kd5RNzbU2iX3JGBEXcfvm4RP5KQvfsJh6waLA_1sA',
  },
];

export default function OrderHistory() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      

      <main className="flex flex-1 flex-col items-center py-10 px-6 md:px-20">
        <div className="w-full max-w-[960px] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-slate-900">Order History</h1>
            <p className="text-slate-500">Manage your past purchases and refine your skincare routine.</p>
          </div>

          {/* AI Suggestion */}
          <section className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-primary/10 p-4 rounded-full text-primary">
              <span className="material-symbols-outlined text-4xl">auto_awesome</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-lg text-slate-900">Personalized AI Adjustment</h3>
              <p className="text-slate-600 mt-1">Based on your recent feedback, we suggest <span className="font-semibold text-primary">Lavender Night Recovery Elixir</span> for better absorption.</p>
            </div>
            <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:brightness-110 transition-all shadow-sm">Update Routine</button>
          </section>

          {/* Tabs */}
          <div className="flex border-b border-primary/10 gap-8 overflow-x-auto pb-px">
            {['All Orders','In Transit','Delivered','Cancelled'].map((tab, i) => (
              <button key={tab} className={`border-b-2 pb-3 px-1 text-sm whitespace-nowrap transition-colors ${i === 0 ? 'border-primary text-primary font-bold' : 'border-transparent text-slate-500 hover:text-primary font-medium'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Orders */}
          <div className="flex flex-col gap-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-primary/10 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Order #{order.id}</p>
                      <p className="text-sm text-slate-500 font-medium">Placed on {order.date}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${order.statusClass}`}>
                      <span className="material-symbols-outlined text-sm">{order.statusIcon}</span>
                      <span className="text-xs font-bold">{order.status}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="size-20 rounded-lg flex-shrink-0 bg-cover bg-center bg-primary/5" style={{ backgroundImage: `url('${order.img}')` }} />
                    <div className="flex flex-1 flex-col justify-center">
                      <h4 className="font-bold text-slate-900">{order.name}</h4>
                      <p className="text-sm text-slate-500">{order.desc}</p>
                      <p className="text-primary font-bold mt-1">{order.price}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 border-t border-primary/10 px-6 py-4 flex flex-wrap items-center gap-3">
                  {order.status === 'In Transit' ? (
                    <>
                      <div className="flex-1 min-w-[200px]">
                        <div className="w-full bg-primary/20 rounded-full h-1.5 mb-2">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: order.progress }} />
                        </div>
                        <p className="text-xs font-medium text-slate-500">Estimated Delivery: {order.delivery}</p>
                      </div>
                      <button className="flex-1 md:flex-none border border-primary text-primary px-5 py-2 rounded-lg text-sm font-bold hover:bg-primary/10 transition-all">Track Order</button>
                    </>
                  ) : (
                    <>
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:brightness-110 transition-all">
                        <span className="material-symbols-outlined text-lg">refresh</span> Reorder
                      </button>
                      {order.feedbackSent ? (
                        <div className="flex items-center gap-1 text-accent-green px-5 py-2">
                          <span className="material-symbols-outlined text-lg">star</span>
                          <span className="text-sm font-bold">Feedback Sent</span>
                        </div>
                      ) : (
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-primary text-primary px-5 py-2 rounded-lg text-sm font-bold hover:bg-primary/10 transition-all">
                          <span className="material-symbols-outlined text-lg">rate_review</span> Give Feedback
                        </button>
                      )}
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 text-slate-500 text-sm font-medium px-5 py-2 hover:text-primary transition-all ml-auto">View Details</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-4 pb-12">
            <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
            {[1,2,3].map(n => (
              <button key={n} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${n === 1 ? 'bg-primary text-white font-bold' : 'hover:bg-primary/10 text-slate-600'}`}>{n}</button>
            ))}
            <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-primary/10 px-6 md:px-20 py-8">
        <div className="max-w-[960px] mx-auto flex flex-col md:flex-row justify-between gap-4">
          <p className="text-sm text-slate-400">© 2024 Dermora Skincare. All rights reserved.</p>
          <div className="flex gap-6 justify-center">
            <a className="text-sm text-slate-400 hover:text-primary transition-colors" href="#">Terms</a>
            <a className="text-sm text-slate-400 hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="text-sm text-slate-400 hover:text-primary transition-colors" href="#">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
