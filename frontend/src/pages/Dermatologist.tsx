import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DermoraLogo } from '../components/Logo';

const doctors = [
  {
    name: 'Dr. Elena Rodriguez', badge: 'Highly Rated', badgeClass: 'text-primary bg-primary/10',
    specialty: 'Cosmetic & Surgical Dermatology • 14 Years Exp.',
    bio: 'Specializing in advanced laser treatments and preventative skin health. Known for a patient-first approach to complex dermatological issues.',
    rating: '4.9', reviews: '1.2k',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkAuFiPzXydqepmx4JXkjS6tW2aBYDL-TXchYx4UeUjxEyZYd9enl87Wh4v97UDEKYEo4XfD704xXUHct9zXfoGLswC-XuXe8-W9L9bYzrKYQ09sKWgiynKEwI_6Z_3d8PH5wSL5LIHowq3R_JG9OPBvU5zKuUGg7oiayJKci-fPvhRsKtBPw6UtkgNkvR65sijfTaYSrCLWSmao4v4iKmzdGLEsKf7EWsiLIUsNbVSOyos0qXBkvFbIQrKtywOVKYNQKuBXk0p6k',
  },
  {
    name: 'Dr. Marcus Thorne', badge: 'Medical Expert', badgeClass: 'text-slate-500 bg-slate-100',
    specialty: 'Clinical Acne Specialist • 9 Years Exp.',
    bio: 'Expert in hormonal acne management and scar revision therapy. Utilizes the latest non-invasive technologies for skin recovery.',
    rating: '4.8', reviews: '840',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwfZ4M1TOzbpireUe_8xUBHiJ5dsIn4AzklOHQZgzbVYnanAttoV26qJfjl7mizNzas_ABAQjAw5Mp08EFy584VOmnCGR2J5uB4ZlPaeCzOzCTXu13KxAilAZJSyJeCvz_4p0AQf_f-C_JmdvsdMpBbpBVlxA-2yN2vPO5N2Aw6sMi-8c8tl3OheHmR1lLgyjeKlbG39Ln04anC_eWmJ36z90r9tF-j6o3XoJt_txGVcda1jdvSInWmn_F4EpLEu_9QBgkacjGXqw',
  },
];

const recProducts = [
  { name: 'Hydrating Cleanser', sub: 'Ceramides + Hyaluronic', price: '$24.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXTRwTMT9y0K4C1FCUHgvDFbw3qz9ANmb5AP_qyD5JoZrUBpKGvhtDGU55fNiwJUyQOxUOCAgsYGYQnHjqY-igqs9IvLBUkSwydZkMce6mzlaDJWgUKiTYGw5-KqmVbf1jXfEyQoV1e0qFyoiO2bI_4C_fYqysE6rApECtQSVnb-BAc_n5Q8ziDRLld6CGtcx25PwiKfSQ1GOfmUhS-aixRNTtlvrFYm0GowdAx9bAHyrCgOF5azOlITvhKs7BE5ky7gLeMsZcb0U' },
  { name: 'Mineral Sunscreen SPF 50', sub: 'Zinc Oxide, Non-Greasy', price: '$32.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAajxqa4kRxwyWlS4XASZAj3YGjtVR0C4rERZ8TPsuMAkEYziUZ7zi-GIxUY4udrTp-_JSajzh8vMNc7bWdRQUBrrJiBnhCzxF0GxiPLwZaen79ghyx_mLpHW8-X21oYbCy_DHwOFHDtMIOVCYoutYL6W-p1L2rX3YwdEre9AmqN3bNXgo7nbym1tCVhOo1Zrv3jAn2GNOLPzasgtmr1rbn1LZoEyjoVzIQ-2jTlm_o3mAsoCM4LJoHQ5wcJVTlbmlv0VNWhREKTPg' },
];

const timeSlots = ['09:00 AM', '10:30 AM', '01:45 PM', '03:30 PM'];

export default function Dermatologist() {
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM');

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light">
      <header className="flex items-center justify-between border-b border-primary/10 bg-white sticky top-0 z-50 px-6 md:px-20 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-primary">
            <div className="size-8"><DermoraLogo /></div>
            <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">Dermora</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Find Doctors</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">My Bookings</a>
            <Link className="text-sm font-medium hover:text-primary transition-colors" to="/products">Shop Products</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:text-primary"><span className="material-symbols-outlined">search</span></button>
          <button className="flex items-center justify-center rounded-full h-10 w-10 bg-primary/10 text-primary">
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] w-full px-6 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-black leading-tight tracking-tight mb-2">Book Your Specialist</h1>
          <p className="text-slate-500 text-lg">Personalized dermatological care from world-class experts.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          {['All Specialists','Acne & Scars','Anti-Aging','Medical Surgery','Cosmetic'].map((f, i) => (
            <button key={f} className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${i === 0 ? 'bg-primary text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary'}`}>{f}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Doctors List */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">verified_user</span> Available Dermatologists
            </h3>
            {doctors.map(doc => (
              <div key={doc.name} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden shrink-0">
                  <img alt={doc.name} className="w-full h-full object-cover" src={doc.img} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${doc.badgeClass}`}>{doc.badge}</span>
                      <h4 className="text-xl font-bold mt-2">{doc.name}</h4>
                      <p className="text-slate-500 text-sm font-medium">{doc.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full">
                      <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                      <span className="font-bold text-sm">{doc.rating}</span>
                      <span className="text-slate-400 text-xs">({doc.reviews})</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mt-4 line-clamp-2">{doc.bio}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="flex-1 md:flex-none px-8 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:opacity-90">Book Now</button>
                    <button className="flex-1 md:flex-none px-8 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors">View Profile</button>
                  </div>
                </div>
              </div>
            ))}

            {/* What to Expect */}
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined">info</span> What to expect</h4>
              <div className="grid md:grid-cols-3 gap-6">
                {[['content_paste_search','Skin Analysis','Detailed visual scan of skin health and texture using high-res imaging.'],
                  ['forum','Q&A Session','Direct time with your specialist to discuss history and concerns.'],
                  ['prescriptions','Routine Plan','A custom medical-grade skincare regimen tailored for you.']].map(([icon, title, desc]) => (
                  <div key={title} className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <p className="font-bold text-sm">{title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-lg">Select Date</h4>
                <div className="flex gap-2">
                  <button className="p-1 text-slate-400 hover:text-primary"><span className="material-symbols-outlined">chevron_left</span></button>
                  <button className="p-1 text-slate-400 hover:text-primary"><span className="material-symbols-outlined">chevron_right</span></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-6">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
                ))}
                {[12,13,14,15,16,17,18].map(d => (
                  <button key={d} className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm transition-all ${d === 14 ? 'bg-primary/10 text-primary font-bold border border-primary/20' : d < 14 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-100'}`}>{d}</button>
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-700">Available Slots</p>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(slot => (
                    <button key={slot} onClick={() => setSelectedSlot(slot)}
                      className={`py-2 rounded-lg text-sm font-semibold transition-all ${selectedSlot === slot ? 'bg-primary text-white shadow-md shadow-primary/20' : 'border border-slate-200 hover:border-primary hover:text-primary'}`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <button className="w-full mt-8 py-4 bg-primary text-white rounded-xl font-black text-lg shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
                Confirm Booking
              </button>
            </div>

            {/* Recommended Products */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h4 className="font-bold text-lg">Top Recommended</h4>
                <Link className="text-primary text-sm font-bold hover:underline" to="/products">View All</Link>
              </div>
              <div className="space-y-3">
                {recProducts.map(p => (
                  <div key={p.name} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 group cursor-pointer hover:border-primary/50 transition-all">
                    <div className="w-16 h-16 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0">
                      <img alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" src={p.img} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">{p.name}</p>
                      <p className="text-slate-400 text-xs font-medium">{p.sub}</p>
                      <p className="text-primary font-bold mt-1 text-sm">{p.price}</p>
                    </div>
                    <button className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined text-base">add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-primary/10 bg-white py-10 px-6">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-3 text-primary mb-4">
              <div className="size-6"><DermoraLogo /></div>
              <h2 className="text-slate-900 text-lg font-bold">Dermora</h2>
            </div>
            <p className="text-slate-500 text-sm max-w-sm">Empowering your skin health journey through professional expertise and specialized care.</p>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-slate-800">Services</h5>
            <ul className="space-y-2 text-sm text-slate-500">
              {['Online Consultation','In-Clinic Booking','Skin Analysis','Dermora Rewards'].map(s => (
                <li key={s}><a className="hover:text-primary" href="#">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-slate-800">Legal</h5>
            <ul className="space-y-2 text-sm text-slate-500">
              {['Privacy Policy','Terms of Service','Medical Disclosure','HIPAA Compliance'].map(s => (
                <li key={s}><a className="hover:text-primary" href="#">{s}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-10 pt-6 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-400">© 2024 Dermora Medical Group. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
