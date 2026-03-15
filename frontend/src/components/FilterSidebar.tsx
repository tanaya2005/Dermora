import React from "react";

export const FilterSidebar: React.FC = () => {
  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="sticky top-28 flex flex-col gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              filter_list
            </span>{" "}
            Filters
          </h3>
          <div className="flex flex-col gap-6 custom-scrollbar">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold uppercase tracking-wider text-primary/70">
                Skin Type
              </p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer group">
                  <input
                    className="rounded border-primary/30 text-primary focus:ring-primary"
                    type="checkbox"
                  />
                  <span className="group-hover:text-primary transition-colors">
                    Oily Skin
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer group">
                  <input
                    className="rounded border-primary/30 text-primary focus:ring-primary"
                    type="checkbox"
                  />
                  <span className="group-hover:text-primary transition-colors">
                    Dry Skin
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer group">
                  <input
                    defaultChecked
                    className="rounded border-primary/30 text-primary focus:ring-primary"
                    type="checkbox"
                  />
                  <span className="group-hover:text-primary transition-colors font-medium">
                    Sensitive Skin
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer group">
                  <input
                    className="rounded border-primary/30 text-primary focus:ring-primary"
                    type="checkbox"
                  />
                  <span className="group-hover:text-primary transition-colors">
                    Combination
                  </span>
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold uppercase tracking-wider text-primary/70">
                Concerns
              </p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer group">
                  <input
                    className="rounded border-primary/30 text-primary focus:ring-primary"
                    type="checkbox"
                  />
                  <span className="group-hover:text-primary transition-colors">
                    Anti-Aging
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer group">
                  <input
                    className="rounded border-primary/30 text-primary focus:ring-primary"
                    type="checkbox"
                  />
                  <span className="group-hover:text-primary transition-colors">
                    Acne & Blemishes
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer group">
                  <input
                    className="rounded border-primary/30 text-primary focus:ring-primary"
                    type="checkbox"
                  />
                  <span className="group-hover:text-primary transition-colors">
                    Hyperpigmentation
                  </span>
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold uppercase tracking-wider text-primary/70">
                Price Range
              </p>
              <input
                className="w-full accent-primary bg-primary/20 rounded-lg h-1.5 cursor-pointer"
                type="range"
              />
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>$0</span>
                <span>$200+</span>
              </div>
            </div>
            <div className="pt-4 border-t border-primary/10">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 cursor-pointer group transition-all hover:bg-primary/10">
                <input
                  defaultChecked
                  className="rounded-full border-primary/30 text-primary focus:ring-primary"
                  type="checkbox"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">
                    Derm Recommended
                  </span>
                  <span className="text-[10px] text-primary">
                    Clinically Proven Results
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
