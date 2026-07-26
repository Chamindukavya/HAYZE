import { ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { RichTextEditor } from "./rich-text-editor";
import { mensCategories, womensCategories, unisexCategories } from "@/utils/catogories";

export type ProductFormState = {
  name: string;
  category: string[];
  gender: "men" | "women" | "unisex";
  price: string;
  stock: string;
  description: string;
  colors: string;
  colorImages?: Record<string, string>;
  sizes: string;
  imageUrls: string;
  isFeatured: boolean;
};

interface ProductFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  isSaving: boolean;
  formState: ProductFormState;
  errorMessage: string;
  selectedFiles: File[];
  selectedFilePreviews: { name: string; url: string }[];
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onColorImageChange?: (color: string, url: string) => void;
  onDescriptionChange: (value: string) => void;
  onCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const ProductFormModal = ({
  isOpen,
  isEditing,
  isSaving,
  formState,
  errorMessage,
  selectedFiles,
  selectedFilePreviews,
  onClose,
  onSubmit,
  onInputChange,
  onColorImageChange,
  onDescriptionChange,
  onCheckboxChange,
  onFileChange,
}: ProductFormModalProps) => {
  if (!isOpen) return null;

  const categoryOptions =
    formState.gender === "men"
      ? mensCategories
      : formState.gender === "women"
        ? womensCategories
        : unisexCategories;

  const selectableCategories = categoryOptions.filter(
    (category) => category !== "All",
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-2xl font-display font-bold tracking-tighter">
            {isEditing ? "EDIT PRODUCT" : "ADD NEW PRODUCT"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">
                  Product Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formState.name}
                  onChange={onInputChange}
                  className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors rounded-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formState.gender}
                  onChange={onInputChange}
                  className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors rounded-lg"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">
                  Price ($)
                </label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.price}
                  onChange={onInputChange}
                  className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors rounded-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">
                  Stock Quantity
                </label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={formState.stock}
                  onChange={onInputChange}
                  className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors rounded-lg"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">
                Categories
              </label>
              <select
                name="category"
                multiple
                value={formState.category}
                onChange={onInputChange}
                className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors rounded-lg min-h-36"
              >
                {selectableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <p className="text-xs text-zinc-500">
                Hold Ctrl or Cmd to select one or more categories.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">
                Description
              </label>
              <RichTextEditor
                value={formState.description}
                onChange={onDescriptionChange}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">
                  Colors (comma separated)
                </label>
                <input
                  name="colors"
                  type="text"
                  value={formState.colors}
                  onChange={onInputChange}
                  placeholder="Black, White, Navy"
                  className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">
                  Sizes (comma separated)
                </label>
                <input
                  name="sizes"
                  type="text"
                  value={formState.sizes}
                  onChange={onInputChange}
                  placeholder="S, M, L, XL"
                  className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors rounded-lg"
                />
              </div>
            </div>
            {formState.colors && formState.colors.trim() && (
              <div className="space-y-4 pt-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                  Color Specific Images (Optional Cloudinary URLs)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formState.colors
                    .split(",")
                    .map((c) => c.trim())
                    .filter(Boolean)
                    .map((color, idx) => (
                      <div key={`${color}-${idx}`} className="space-y-1 relative">
                        <label className="text-xs font-semibold text-white">{color}</label>
                        <input
                          type="text"
                          value={formState.colorImages?.[color] || ""}
                          onChange={(e) => onColorImageChange?.(color, e.target.value)}
                          placeholder="Image URL"
                          className="w-full bg-zinc-950 border border-white/5 px-3 py-2 text-xs focus:outline-none focus:border-white/20 transition-colors rounded"
                        />
                        {formState.colorImages?.[color] && (
                          <div className="mt-2 w-full aspect-square relative rounded overflow-hidden border border-white/10">
                            <Image
                              src={formState.colorImages[color]}
                              alt={color}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
            <label className="flex items-center gap-3 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={formState.isFeatured}
                onChange={onCheckboxChange}
                className="h-4 w-4 rounded border-white/20 bg-zinc-950"
              />
              Mark as featured product
            </label>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">
                Product Images
              </label>
              <textarea
                name="imageUrls"
                rows={3}
                value={formState.imageUrls}
                onChange={onInputChange}
                placeholder="Paste Cloudinary image URLs (comma or new line separated)"
                className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors rounded-lg resize-y"
              />
              <p className="text-xs text-zinc-500">
                Add image URLs manually, upload files, or use both.
              </p>
              <div className="border-2 border-dashed border-white/5 rounded-xl p-8 text-center hover:border-white/10 transition-colors cursor-pointer">
                <Plus className="mx-auto mb-2 text-zinc-500" size={24} />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onFileChange}
                  className="block mx-auto text-xs text-zinc-400 file:mr-3 file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white file:text-black file:border-0 file:cursor-pointer"
                />
                <p className="text-xs text-zinc-500 mt-3">
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} file(s) selected`
                    : "Select one or more images"}
                </p>
              </div>
              {selectedFilePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  {selectedFilePreviews.map((preview) => (
                    <div
                      key={preview.url}
                      className="bg-zinc-950 border border-white/10 rounded-lg overflow-hidden"
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={preview.url}
                          alt={preview.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400 px-2 py-2 truncate">
                        {preview.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errorMessage && (
              <p className="text-sm text-red-400">{errorMessage}</p>
            )}
          </div>
          <div className="p-8 border-t border-white/5 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Update Product"
                  : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
