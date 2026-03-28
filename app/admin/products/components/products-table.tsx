import Image from "next/image";
import { Edit2, Trash2, ExternalLink } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductsTableProps {
  isLoading: boolean;
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductsTable = ({
  isLoading,
  products,
  onEdit,
  onDelete,
}: ProductsTableProps) => {
  return (
    <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] uppercase tracking-widest text-zinc-500 border-b border-white/5">
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">
                Loading products...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-16 bg-zinc-800 rounded overflow-hidden">
                      <Image
                        src={optimizeCloudinaryUrl(
                          product.images?.[0] ||
                            "https://picsum.photos/seed/vibe-product-fallback/100/150",
                        )}
                        alt={product.name}
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="font-bold">{product.name}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                        SKU: {product._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  {product.category}
                </td>
                <td className="px-6 py-4 font-bold">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                    {product.stock} in stock
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white/5 text-white">
                    {product.stock > 0 ? "Published" : "Out of stock"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 text-zinc-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(product._id)}
                      className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
