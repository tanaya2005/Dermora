import { DermoraLogo } from '../components/Logo';

type StockStatus = 'Low Stock' | 'Medium' | 'Optimal';

const inventoryItems = [
  { name: 'Vitamin C Radiance Serum', sku: 'DERM-001-VC', category: 'Facial Care', units: 12, max: 80, status: 'Low Stock' as StockStatus, barColor: 'bg-red-400', textColor: 'text-red-500', dotClass: 'bg-red-300' },
  { name: 'Hyaluronic Acid Hydrator', sku: 'DERM-042-HA', category: 'Serums', units: 45, max: 100, status: 'Medium' as StockStatus, barColor: 'bg-amber-300', textColor: 'text-amber-500', dotClass: 'bg-amber-300' },
  { name: 'Overnight Repair Cream', sku: 'DERM-105-OR', category: 'Moisturizers', units: 210, max: 230, status: 'Optimal' as StockStatus, barColor: 'bg-emerald-400', textColor: 'text-emerald-500', dotClass: 'bg-emerald-300' },
  { name: 'Smoothing Eye Gel', sku: 'DERM-003-EG', category: 'Facial Care', units: 145, max: 200, status: 'Optimal' as StockStatus, barColor: 'bg-emerald-400', textColor: 'text-emerald-500', dotClass: 'bg-emerald-300' },
];

const navLinks = [
  { icon: 'dashboard', label: 'Dashboard', active: false },
  { icon: 'inventory_2', label: 'Inventory', active: true },
  { icon: 'local_shipping', label: 'Orders', active: false },
  { icon: 'group', label: 'Suppliers', active: false },
];

export default function Inventory() {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light">
      {/* Sidebar */}
      <aside className="w-64 border-r border-primary/10 bg-white hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
            <DermoraLogo className="size-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-primary">Dermora</h2>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navLinks.map(({ icon, label, active }) => (
            <a key={label} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-primary/5'}`} href="#">
              <span className="material-symbols-outlined">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-primary/10">
          <div className="flex items-center gap-3 p-2 bg-primary/5 rounded-xl">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">account_circle</span>
            </div>
            <div>
              <p className="text-xs font-bold">Admin User</p>
              <p className="text-[10px] text-slate-500">Inventory Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-primary/10 bg-white flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold">Inventory Management</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-primary/5 rounded-full relative">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-primary rounded-full" />
            </button>
            <button className="p-2 text-slate-500 hover:bg-primary/5 rounded-full">
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>
          </div>
        </header>

        <div className="p-8 pb-0 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Stock Overview</h2>
              <p className="text-slate-500 text-sm">Monitor and manage product availability</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-sm">add</span> Add Product
              </button>
              <button className="border border-primary text-primary px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-primary/5 transition-colors">
                <span className="material-symbols-outlined text-sm">download</span> Export CSV
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-primary/10 shadow-sm">
            <div className="relative flex-1 min-w-[300px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-background-light border-none rounded-lg focus:ring-1 focus:ring-primary text-sm" placeholder="Search products, SKUs, or categories..." type="text" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {['All Items','Low Stock','Skincare','Essential Oils'].map((f, i) => (
                <button key={f} className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${i === 0 ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors'}`}>{f}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-primary/5">
                <tr>
                  {['Product Name','Category','Stock Level','Status',''].map(h => (
                    <th key={h} className={`px-6 py-4 text-sm font-semibold text-slate-700 border-b border-primary/10 ${h === '' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {inventoryItems.map(item => (
                  <tr key={item.sku} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary/50">inventory_2</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-slate-500">SKU: {item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md">{item.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-sm font-bold ${item.textColor}`}>{item.units} units</span>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full ${item.barColor} rounded-full`} style={{ width: `${Math.round((item.units / item.max) * 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`size-2 rounded-full ${item.dotClass}`} />
                        <span className="text-xs font-medium text-slate-600">{item.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-primary hover:bg-primary/10 rounded-lg"><span className="material-symbols-outlined text-lg">edit</span></button>
                        <button className="p-2 text-primary hover:bg-primary/10 rounded-lg"><span className="material-symbols-outlined text-lg">storefront</span></button>
                        <button className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg font-bold">Reorder</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-xs text-slate-500 font-medium">Showing 1 to {inventoryItems.length} of 128 products</p>
            <div className="flex gap-2">
              <button className="p-2 border border-primary/10 bg-white rounded-lg hover:bg-primary/5"><span className="material-symbols-outlined text-lg">chevron_left</span></button>
              {[1,2,3].map(n => (
                <button key={n} className={`size-9 border rounded-lg text-xs font-bold transition-colors ${n === 1 ? 'border-primary bg-primary text-white' : 'border-primary/10 bg-white hover:bg-primary/5'}`}>{n}</button>
              ))}
              <button className="p-2 border border-primary/10 bg-white rounded-lg hover:bg-primary/5"><span className="material-symbols-outlined text-lg">chevron_right</span></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
