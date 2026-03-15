import React from "react";
import { Link } from "react-router-dom";

export const InventoryManagementPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-black min-h-screen">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-primary/10 bg-white dark:bg-background-dark/50 hidden md:flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
              <span className="material-symbols-outlined">spa</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-primary">
              Dermora
            </h2>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            <Link
              className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-primary/5 rounded-lg"
              to="/admin"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link
              className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg"
              to="/admin/inventory"
            >
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="text-sm font-medium">Inventory</span>
            </Link>
            <Link
              className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-primary/5 rounded-lg"
              to="#"
            >
              <span className="material-symbols-outlined">local_shipping</span>
              <span className="text-sm font-medium">Orders</span>
            </Link>
            <Link
              className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-primary/5 rounded-lg"
              to="#"
            >
              <span className="material-symbols-outlined">group</span>
              <span className="text-sm font-medium">Suppliers</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-primary/10">
            <div className="flex items-center gap-3 p-2 bg-primary/5 rounded-xl">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">
                  account_circle
                </span>
              </div>
              <div>
                <p className="text-xs font-bold">Admin User</p>
                <p className="text-[10px] text-slate-500">Inventory Manager</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          {/* Table Controls */}
          <div className="p-8 pb-0 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight">
                  Stock Overview
                </h2>
                <p className="text-slate-500 text-sm">
                  Monitor and manage product availability
                </p>
              </div>
              <div className="flex gap-3">
                <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Product
                </button>
                <button className="border border-primary text-primary px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-primary/5 transition-colors">
                  <span className="material-symbols-outlined text-sm">
                    download
                  </span>
                  Export CSV
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-background-dark/30 p-4 rounded-xl border border-primary/10 shadow-sm">
              <div className="relative flex-1 min-w-[300px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-background-dark border-none rounded-lg focus:ring-1 focus:ring-primary text-sm"
                  placeholder="Search products, SKUs, or categories..."
                  type="text"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                <button className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold whitespace-nowrap">
                  All Items
                </button>
                <button className="px-4 py-1.5 bg-black dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-semibold whitespace-nowrap">
                  Low Stock
                </button>
                <button className="px-4 py-1.5 bg-black dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-semibold whitespace-nowrap">
                  Skincare
                </button>
                <button className="px-4 py-1.5 bg-black dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-semibold whitespace-nowrap">
                  Essential Oils
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-slate-500 text-xs font-medium">
                  <span className="material-symbols-outlined text-sm">
                    filter_list
                  </span>
                  More Filters
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto p-8">
            <div className="bg-white dark:bg-background-dark/30 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-primary/5">
                  <tr>
                    <th className="px-6 py-4 font-serif text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-primary/10">
                      Product Name
                    </th>
                    <th className="px-6 py-4 font-serif text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-primary/10">
                      Category
                    </th>
                    <th className="px-6 py-4 font-serif text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-primary/10">
                      Stock Level
                    </th>
                    <th className="px-6 py-4 font-serif text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-primary/10">
                      Status
                    </th>
                    <th className="px-6 py-4 font-serif text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-primary/10 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {/* Item 1: Low Stock */}
                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-black flex-shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary/50">
                            image
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            Vitamin C Radiance Serum
                          </p>
                          <p className="text-xs text-slate-500">
                            SKU: DERM-001-VC
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md">
                        Facial Care
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-red-500">
                          12 units
                        </span>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400 w-[15%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-[#fca5a5]"></div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          Low Stock
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                          title="Edit Stock"
                        >
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </button>
                        <button
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                          title="Supplier Details"
                        >
                          <span className="material-symbols-outlined text-lg">
                            storefront
                          </span>
                        </button>
                        <button className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg font-bold">
                          Reorder
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Item 2: Medium Stock */}
                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-black flex-shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary/50">
                            image
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            Hyaluronic Acid Hydrator
                          </p>
                          <p className="text-xs text-slate-500">
                            SKU: DERM-042-HA
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md">
                        Serums
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-amber-500">
                          45 units
                        </span>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-300 w-[45%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-[#fcd34d]"></div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          Medium
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </button>
                        <button className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                          <span className="material-symbols-outlined text-lg">
                            storefront
                          </span>
                        </button>
                        <button className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg font-bold">
                          Reorder
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Item 3: High Stock */}
                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-black flex-shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary/50">
                            image
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            Overnight Repair Cream
                          </p>
                          <p className="text-xs text-slate-500">
                            SKU: DERM-105-OR
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md">
                        Moisturizers
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-emerald-500">
                          210 units
                        </span>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 w-[90%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-[#86efac]"></div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          Optimal
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </button>
                        <button className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                          <span className="material-symbols-outlined text-lg">
                            storefront
                          </span>
                        </button>
                        <button className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg font-bold">
                          Reorder
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Item 4: High Stock */}
                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-black flex-shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary/50">
                            image
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            Smoothing Eye Gel
                          </p>
                          <p className="text-xs text-slate-500">
                            SKU: DERM-003-EG
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md">
                        Facial Care
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-emerald-500">
                          145 units
                        </span>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 w-[75%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-[#86efac]"></div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          Optimal
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </button>
                        <button className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                          <span className="material-symbols-outlined text-lg">
                            storefront
                          </span>
                        </button>
                        <button className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg font-bold">
                          Reorder
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-slate-500 font-medium">
                Showing 1 to 4 of 128 products
              </p>
              <div className="flex gap-2">
                <button className="p-2 border border-primary/10 bg-white dark:bg-background-dark/30 rounded-lg hover:bg-primary/5">
                  <span className="material-symbols-outlined text-lg">
                    chevron_left
                  </span>
                </button>
                <button className="size-9 border border-primary bg-primary text-white rounded-lg text-xs font-bold">
                  1
                </button>
                <button className="size-9 border border-primary/10 bg-white dark:bg-background-dark/30 rounded-lg text-xs font-bold hover:bg-primary/5">
                  2
                </button>
                <button className="size-9 border border-primary/10 bg-white dark:bg-background-dark/30 rounded-lg text-xs font-bold hover:bg-primary/5">
                  3
                </button>
                <button className="p-2 border border-primary/10 bg-white dark:bg-background-dark/30 rounded-lg hover:bg-primary/5">
                  <span className="material-symbols-outlined text-lg">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
