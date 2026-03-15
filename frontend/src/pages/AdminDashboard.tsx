import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 bg-white px-6 md:px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-primary">
            <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">Dermora Admin</h2>
          </div>
          <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-slate-100">
              <div className="text-slate-500 flex items-center justify-center pl-4">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 h-full placeholder:text-slate-500 px-4 pl-2 text-sm font-normal" placeholder="Search analytics..." />
            </div>
          </label>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button className="flex items-center justify-center rounded-xl size-10 bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="flex items-center justify-center rounded-xl size-10 bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCb9Eu0DTBRi12GK4n5G-D76djylsKxo8c7HLpk6cuIdxukJGnWHJjFLrwYmZwe_sfdvCdsm66V-w99JSLJ0yhN1l3tvuNBXfKN5RHk0jukiQF3MX1lpIPBqf9DDbhnJ0jP52PZ9rvwZOGdKEyMAVQTbpJuke60GKshWiXXwV4BBddpQSppVl5DpGAzlU2b_xAghC2ecHhZSO4cQWvj4f-ivEvn2dduMh4snBriTkh6OXdvQ6VSMzv76VytwURMITDWHDnN41E4aqQ")' }}></div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden lg:flex w-64 flex-col border-r border-primary/10 bg-white p-4 gap-6">
          <div className="flex flex-col gap-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Main Menu</p>
            <nav className="flex flex-col gap-1">
              <Link className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/20" to="/admin">
                <span className="material-symbols-outlined">dashboard</span>
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-primary/10 hover:text-primary transition-all" to="/admin/sales">
                <span className="material-symbols-outlined">analytics</span>
                <span className="text-sm font-medium">Sales Performance</span>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-primary/10 hover:text-primary transition-all" to="/admin/inventory">
                <span className="material-symbols-outlined">inventory_2</span>
                <span className="text-sm font-medium">Inventory</span>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-primary/10 hover:text-primary transition-all" to="/admin/customers">
                <span className="material-symbols-outlined">group</span>
                <span className="text-sm font-medium">Customers</span>
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Logistics</p>
            <nav className="flex flex-col gap-1">
              <Link className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-primary/10 hover:text-primary transition-all" to="/admin/shipments">
                <span className="material-symbols-outlined">local_shipping</span>
                <span className="text-sm font-medium">Shipments</span>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-primary/10 hover:text-primary transition-all" to="/admin/vendors">
                <span className="material-symbols-outlined">storefront</span>
                <span className="text-sm font-medium">Vendors</span>
              </Link>
            </nav>
          </div>

          <div className="mt-auto p-4 bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-xs font-semibold text-primary mb-1">Quick Action</p>
            <button className="w-full bg-primary text-white text-xs font-bold py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
              Vendor Reorder
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
              <p className="text-slate-500">Real-time performance and inventory metrics for Dermora Skincare.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Last 30 Days
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold mt-1 text-slate-900">$128,430.00</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <span className="material-symbols-outlined">card_membership</span>
                </div>
                <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-full">+5.2%</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Active Subscriptions</p>
              <p className="text-2xl font-bold mt-1 text-slate-900">1,240</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                  <span className="material-symbols-outlined">shopping_bag</span>
                </div>
                <span className="text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded-full">+2.4%</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Active Orders</p>
              <p className="text-2xl font-bold mt-1 text-slate-900">86</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <span className="material-symbols-outlined">inventory</span>
                </div>
                <span className="text-rose-500 text-xs font-bold bg-rose-50 px-2 py-1 rounded-full">-3%</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Stock Efficiency</p>
              <p className="text-2xl font-bold mt-1 text-slate-900">94.2%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Monthly Sales Performance</h3>
                  <p className="text-sm text-slate-500">Revenue growth over the last 6 months</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-primary">$42,000</p>
                  <p className="text-xs text-emerald-600 font-bold">+8.4% vs last month</p>
                </div>
              </div>
              <div className="h-64 flex flex-col justify-between">
                <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#b23a48" stopOpacity="0.3"></stop>
                      <stop offset="100%" stopColor="#b23a48" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <path d="M0 120 Q 50 110, 80 80 T 160 60 T 240 90 T 320 40 T 400 20 V 150 H 0 Z" fill="url(#chartGradient)"></path>
                  <path d="M0 120 Q 50 110, 80 80 T 160 60 T 240 90 T 320 40 T 400 20" fill="none" stroke="#b23a48" strokeLinecap="round" strokeWidth="3"></path>
                  <circle cx="80" cy="80" fill="white" r="4" stroke="#b23a48" strokeWidth="2"></circle>
                  <circle cx="160" cy="60" fill="white" r="4" stroke="#b23a48" strokeWidth="2"></circle>
                  <circle cx="240" cy="90" fill="white" r="4" stroke="#b23a48" strokeWidth="2"></circle>
                  <circle cx="320" cy="40" fill="white" r="4" stroke="#b23a48" strokeWidth="2"></circle>
                  <circle cx="400" cy="20" fill="white" r="4" stroke="#b23a48" strokeWidth="2"></circle>
                </svg>
                <div className="flex justify-between text-xs font-bold text-slate-400 mt-4 uppercase tracking-wider">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Low Stock Alerts</h3>
                <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-1 rounded uppercase">3 Critical</span>
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-rose-50 border border-rose-100">
                  <div className="size-12 rounded-lg bg-cover bg-center shrink-0 border border-rose-200" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCFP6B4cG_Yj-bzJ2myAoMxHb7e15Fn5vi1FQy7-zM5a8pBXryGclTnxj12hM6-FyCF-kqqkLhEI3hgDuznqa92WCWniEytih9rzhq7DzR65AcQqyWfLl-bbpSAA5U80pKgT-zz7fMc_of3j_PQtcov_nm6RgIv_wOdpF53fvmRHsujenfeRbF-E0kBBk65jgldIAxUHE3LJYW4vjB3DdgIguk11hW6CbNnDcEyxA4dxvMHChauZ_-RCh2vJutRJktnpsC_oiDGKVk")' }}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">Vitamin C Glow Serum</p>
                    <p className="text-xs text-rose-600 font-medium">8 units remaining</p>
                  </div>
                  <button className="material-symbols-outlined text-rose-400 hover:text-rose-600">reorder</button>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-rose-50 border border-rose-100">
                  <div className="size-12 rounded-lg bg-cover bg-center shrink-0 border border-rose-200" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMM25c9grU0UjeTWhKdBO8bnRcvleMo2SUriGkdff1bZmKCb5cns4dP3w4CNLzJU5gt51T0D4WpF4bLotVZxjmHkHNjTiN4V4cQU_Ef7d4VHxv79BbpXgM_27RRvGc28ksoyYy0eDQW5c_vWOwgxb2kWqN4ALagsiHVPqywup2WNB6zKW1CqP-J2VLE0Gx4riAkRtTbKpEItF_8wXjwoB6It79FBD9zZ-0SgTpZZgmAw7bCbY4hctpRGDr2z-ndmHEUz95DeaLFS0")' }}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">Hydra-Lift Moisturizer</p>
                    <p className="text-xs text-rose-600 font-medium">12 units remaining</p>
                  </div>
                  <button className="material-symbols-outlined text-rose-400 hover:text-rose-600">reorder</button>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="size-12 rounded-lg bg-cover bg-center shrink-0 border border-amber-200" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD4LYNk5soCGn2fAky7xsc_VJy7kHzxPDAjuls2awmpNGWt7ZGlyb1w-RZsXBWJ6aBMfKbQwbqz1eRpIP1AODEmkmPzrnSwCdvmVk0pMsElmUZJh_9_KuhYn-CV58uHlvNsNR78U6bTMynOkQT62Vikpjyf1Wk641h794OzgLE73rOndB0pgph4ylfy-vusdN5eYO7x1_PoKsBIpLmcRcwTYKmwXC5sPvzOuNnEicrSRNBBfqGn-wOrnIOY8yaQWn_5ZWnG-PBYPr0")' }}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">Gentle Foaming Cleanser</p>
                    <p className="text-xs text-amber-600 font-medium">24 units (Warning)</p>
                  </div>
                  <button className="material-symbols-outlined text-amber-400 hover:text-amber-600">reorder</button>
                </div>
              </div>
              <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium hover:border-primary hover:text-primary transition-all">
                View All Inventory
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Top Selling Products</h3>
              <button className="text-primary text-sm font-bold hover:underline">View Sales Report</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Sold</th>
                    <th className="px-6 py-4 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCEohTOX_EaHd8NNRP707qVkFfzWGRcXoH_Q9js-SAioDqODc-2GS8HgMy1-ZdY-9bp-r54DnJURwg6fqPcMJ4EbBtaKSlW_3dsGWLFtMJFO5iaDTdWUsZeS9_M_wFijJfsqq4Kl6otMS3KafAB1DMxzDu2vE7m3U6nqKqJG2E4SdFYUAaag6nKP17k20-DuTzq5HGyVodjzAKdCictrkxQw9WQ0NX4qeN68O7YOuzEcPGzsG47Q4kiWbU3YLmC1NhXUNu1xsoBzdM")' }}></div>
                        <span className="text-sm font-medium">Midnight Recovery Oil</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">DERM-9283</td>
                    <td className="px-6 py-4 text-sm">$84.00</td>
                    <td className="px-6 py-4 text-sm">842</td>
                    <td className="px-6 py-4 text-sm font-bold text-right">$70,728.00</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD0eMAMQhZJEJ2u1rCheJ-kf9QrvXEiMYKNdtjd_o8W-X0wxSbwxCEf1yLhZhHSnbyOttyIYginSKHhaOooXkBa8njvSzrj9meWjKsts6CAntKA5pU9NmdhNA1cFF0sgTSqwn0d4cX2IlhjKpL5kXbCWqAo_HdKMgluG-OoHhkwri6ENVBKAiA61PDEt8kINWaGrIQmqcVFiZd6RbfdaeRj0yY9cWWq_SoSR8hWTrrRgzf-hs8LAcN2KSFqZp8MaoPQpHrD1PyWhaI")' }}></div>
                        <span className="text-sm font-medium">Daily SPF 50 Shield</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">DERM-1024</td>
                    <td className="px-6 py-4 text-sm">$38.00</td>
                    <td className="px-6 py-4 text-sm">756</td>
                    <td className="px-6 py-4 text-sm font-bold text-right">$28,728.00</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAjffMF2jNB8BlBM8TBvTRkGWKwrYLVZV_VCJsdY-LgkIYI3NWhO7bsfZbtA7Lo8TPp2epqZB-E6jWrKlWyEM7HmAA0i4iQVvbGV26y3RIjkT8oYWJyd8EN6O2hFDEkv38FuygOIZNW9ejmEpP1nTJ3tHN30325L_3GS5H6j6X3z2MTEem33LgJ73CgBkHnXWJVfd9szIbYPh5GQ4qMu1HyPKVNoMVt8uEla_QR8J3Cz79SL-wfWs03feAgSfy62UvSAKyWJKSEG1s")' }}></div>
                        <span className="text-sm font-medium">Retinol Eye Treatment</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">DERM-4421</td>
                    <td className="px-6 py-4 text-sm">$56.00</td>
                    <td className="px-6 py-4 text-sm">520</td>
                    <td className="px-6 py-4 text-sm font-bold text-right">$29,120.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
