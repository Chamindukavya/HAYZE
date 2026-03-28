import { Search, Filter } from "lucide-react";

interface ProductsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  genderFilter: "all" | "men" | "women" | "unisex";
  setGenderFilter: (value: "all" | "men" | "women" | "unisex") => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  featuredFilter: "all" | "featured" | "not-featured";
  setFeaturedFilter: (value: "all" | "featured" | "not-featured") => void;
  categoryOptions: string[];
}

export const ProductsFilter = ({
  searchTerm,
  setSearchTerm,
  genderFilter,
  setGenderFilter,
  categoryFilter,
  setCategoryFilter,
  featuredFilter,
  setFeaturedFilter,
  categoryOptions,
}: ProductsFilterProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          size={16}
        />
        <input
          type="text"
          placeholder="Search products by name, SKU..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full bg-zinc-900 border border-white/5 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors rounded-lg"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 border border-white/5 px-3 py-2 text-sm text-zinc-300 rounded-lg">
          <Filter size={16} className="text-zinc-500" />
          <select
            value={genderFilter}
            onChange={(event) =>
              setGenderFilter(
                event.target.value as "all" | "men" | "women" | "unisex",
              )
            }
            className="bg-transparent focus:outline-none"
          >
            <option value="all" className="bg-zinc-900">
              All genders
            </option>
            <option value="men" className="bg-zinc-900">
              Men
            </option>
            <option value="women" className="bg-zinc-900">
              Women
            </option>
            <option value="unisex" className="bg-zinc-900">
              Unisex
            </option>
          </select>
        </div>

        <div className="border border-white/5 px-3 py-2 text-sm text-zinc-300 rounded-lg">
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="bg-transparent focus:outline-none"
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category} className="bg-zinc-900">
                {category === "all" ? "All categories" : category}
              </option>
            ))}
          </select>
        </div>

        <div className="border border-white/5 px-3 py-2 text-sm text-zinc-300 rounded-lg">
          <select
            value={featuredFilter}
            onChange={(event) =>
              setFeaturedFilter(
                event.target.value as "all" | "featured" | "not-featured",
              )
            }
            className="bg-transparent focus:outline-none"
          >
            <option value="all" className="bg-zinc-900">
              All products
            </option>
            <option value="featured" className="bg-zinc-900">
              Featured
            </option>
            <option value="not-featured" className="bg-zinc-900">
              Not featured
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};
