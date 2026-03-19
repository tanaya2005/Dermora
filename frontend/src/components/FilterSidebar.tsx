import React, { useState } from "react";

interface FilterSidebarProps {
  onCategoryChange?: (category: string) => void;
  onSearchChange?: (search: string) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  onCategoryChange,
  onSearchChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Cleansers',
    'Moisturizers', 
    'Serums',
    'Sunscreen',
    'Night Creams',
    'Toners',
    'Eye Care',
    'Masks',
    'Mists'
  ];

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? '' : category;
    setSelectedCategory(newCategory);
    onCategoryChange?.(newCategory);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange?.(value);
  };

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
            {/* Search */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold uppercase tracking-wider text-primary/70">
                Search
              </p>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-primary/20 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold uppercase tracking-wider text-primary/70">
                Category
              </p>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 text-sm cursor-pointer group">
                    <input
                      className="rounded border-primary/30 text-primary focus:ring-primary"
                      type="checkbox"
                      checked={selectedCategory === category}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <span className="group-hover:text-primary transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

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
