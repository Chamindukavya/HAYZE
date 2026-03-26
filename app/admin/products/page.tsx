"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState, useRef } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Bold,
  Italic,
  List,
  ListOrdered,
} from "lucide-react";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/lib/utils";
import type { Product } from "@/types";
import { categories, mensCategories, womensCategories, unisexCategories } from "@/utils/catogories";

type ProductFormState = {
  name: string;
  category: string;
  gender: "men" | "women" | "unisex";
  price: string;
  stock: string;
  description: string;
  colors: string;
  sizes: string;
  imageUrls: string;
  isFeatured: boolean;
};

const initialFormState: ProductFormState = {
  name: "",
  category: "",
  gender: "unisex",
  price: "",
  stock: "",
  description: "",
  colors: "",
  sizes: "",
  imageUrls: "",
  isFeatured: false,
};

const RichTextEditor = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleCommand = (e: React.MouseEvent, command: string, arg?: string) => {
    e.preventDefault();
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  };

  return (
    <div className="w-full bg-zinc-950 border border-white/5 rounded-lg overflow-hidden transition-colors focus-within:border-white/20">
      <div className="flex items-center gap-1 border-b border-white/5 p-2 bg-zinc-900/50">
        <button type="button" onClick={(e) => handleCommand(e, 'bold')} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Bold"><Bold size={14} /></button>
        <button type="button" onClick={(e) => handleCommand(e, 'italic')} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Italic"><Italic size={14} /></button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button type="button" onClick={(e) => handleCommand(e, 'insertUnorderedList')} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Bullet List"><List size={14} /></button>
        <button type="button" onClick={(e) => handleCommand(e, 'insertOrderedList')} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Numbered List"><ListOrdered size={14} /></button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="px-4 py-3 min-h-[120px] text-sm focus:outline-none outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_b]:font-bold [&_i]:italic"
      />
    </div>
  );
};

export default function AdminProducts() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<"all" | "men" | "women" | "unisex">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "not-featured">("all");
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formState, setFormState] =
    useState<ProductFormState>(initialFormState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedFilePreviews = useMemo(() => {
    return selectedFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      selectedFilePreviews.forEach((preview) =>
        URL.revokeObjectURL(preview.url),
      );
    };
  }, [selectedFilePreviews]);

  const categoryOptions = useMemo(() => {
    const source =
      genderFilter === "all"
        ? products
        : products.filter((product) => product.gender === genderFilter);

    const values = Array.from(new Set(source.map((product) => product.category)));
    values.sort((a, b) => a.localeCompare(b));

    return ["all", ...values];
  }, [products, genderFilter]);

  useEffect(() => {
    if (!categoryOptions.includes(categoryFilter)) {
      setCategoryFilter("all");
    }
  }, [categoryFilter, categoryOptions]);

  const filteredProducts = useMemo(() => {
    const value = searchTerm.toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !searchTerm.trim() ||
        product.name.toLowerCase().includes(value) ||
        product.category.toLowerCase().includes(value);
      const matchesGender =
        genderFilter === "all" || product.gender === genderFilter;
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" ? product.isFeatured : !product.isFeatured);

      return (
        matchesSearch &&
        matchesGender &&
        matchesCategory &&
        matchesFeatured
      );
    });
  }, [products, searchTerm, genderFilter, categoryFilter, featuredFilter]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setErrorMessage("");
        const response = await fetch("/api/products", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = (await response.json()) as Product[];
        setProducts(data);
      } catch (error) {
        setErrorMessage("Unable to load products right now.");
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const resetModal = () => {
    setFormState(initialFormState);
    setSelectedFiles([]);
    setErrorMessage("");
    setIsAddModalOpen(false);
    setEditingProductId(null);
  };

  const handleEditClick = (product: Product) => {
    setFormState({
      name: product.name || "",
      category: product.category || "Tops",
      gender: product.gender || "unisex",
      price: product.price?.toString() || "0",
      stock: product.stock?.toString() || "0",
      description: product.description || "",
      colors: product.colors?.join(", ") || "",
      sizes: product.sizes?.join(", ") || "",
      imageUrls: product.images?.join("\n") || "",
      isFeatured: product.isFeatured || false,
    });
    setEditingProductId(product._id);
    setSelectedFiles([]);
    setErrorMessage("");
    setIsAddModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!deletingProductId) return;
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/products/${deletingProductId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts((current) =>
        current.filter((p) => p._id !== deletingProductId),
      );
      setDeletingProductId(null);
    } catch (error) {
      console.error(error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setSelectedFiles(Array.from(files));
  };

  const uploadImagesToCloudinary = async () => {
    const imageUrls: string[] = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = (await response.json()) as {
        secure_url?: string;
        url?: string;
      };
      const imageUrl = data.secure_url || data.url;

      if (!imageUrl) {
        throw new Error("Cloudinary did not return an image URL");
      }

      imageUrls.push(imageUrl);
    }

    return imageUrls;
  };

  const parseManualImageUrls = (value: string) => {
    const entries = value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);

    const invalidEntries = entries.filter(
      (entry) => !/^https?:\/\//i.test(entry),
    );

    return { entries, invalidEntries };
  };

  const handleCreateProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { entries: manualImageUrls, invalidEntries } =
      parseManualImageUrls(formState.imageUrls);

    if (invalidEntries.length > 0) {
      setErrorMessage("Image URLs must start with http:// or https://.");
      return;
    }

    if (
      !formState.name ||
      !formState.description ||
      !formState.price ||
      !formState.stock
    ) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (
      !editingProductId &&
      selectedFiles.length === 0 &&
      manualImageUrls.length === 0
    ) {
      setErrorMessage("Please upload at least one image or add an image URL.");
      return;
    }

    try {
      setIsSavingProduct(true);
      setErrorMessage("");

      let images: string[] = [...manualImageUrls];
      if (selectedFiles.length > 0) {
        const uploadedUrls = await uploadImagesToCloudinary();
        images = [...images, ...uploadedUrls];
      }

      const payload: any = {
        name: formState.name.trim(),
        description: formState.description.trim(),
        price: Number(formState.price),
        category: formState.category,
        gender: formState.gender,
        stock: Number(formState.stock),
        colors: formState.colors
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        sizes: formState.sizes
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        isFeatured: formState.isFeatured,
      };

      if (images.length > 0) {
        payload.images = images;
      }

      const method = editingProductId ? "PUT" : "POST";
      const endpoint = editingProductId
        ? `/api/products/${editingProductId}`
        : "/api/products";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${editingProductId ? "update" : "create"} product`,
        );
      }

      const savedProduct = (await response.json()) as Product;

      if (editingProductId) {
        setProducts((previous) =>
          previous.map((p) => (p._id === editingProductId ? savedProduct : p)),
        );
      } else {
        setProducts((previous) => [savedProduct, ...previous]);
      }

      resetModal();
    } catch (error) {
      setErrorMessage(
        `Could not ${editingProductId ? "update" : "save"} product. Please try again.`,
      );
    } finally {
      setIsSavingProduct(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tighter">
            PRODUCTS
          </h1>
          <p className="text-zinc-500 text-sm">
            Manage your inventory and product details.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-white text-black px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-200 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Filters */}
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
              onChange={(event) => setGenderFilter(event.target.value as "all" | "men" | "women" | "unisex")}
              className="bg-transparent focus:outline-none"
            >
              <option value="all" className="bg-zinc-900">All genders</option>
              <option value="men" className="bg-zinc-900">Men</option>
              <option value="women" className="bg-zinc-900">Women</option>
              <option value="unisex" className="bg-zinc-900">Unisex</option>
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
              <option value="all" className="bg-zinc-900">All products</option>
              <option value="featured" className="bg-zinc-900">Featured</option>
              <option value="not-featured" className="bg-zinc-900">Not featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
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
            {isLoadingProducts ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-zinc-500"
                >
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-zinc-500"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
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
                            "https://picsum.photos/seed/vibe-product-fallback/100/150"
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
                        onClick={() => handleEditClick(product)}
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingProductId(product._id)}
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

      {errorMessage && !isAddModalOpen && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}

      {/* Add Product Modal (Simplified) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold tracking-tighter">
                {editingProductId ? "EDIT PRODUCT" : "ADD NEW PRODUCT"}
              </h2>
              <button
                type="button"
                onClick={resetModal}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleCreateProduct}>
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formState.category}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors rounded-lg"
                  >
                    {/* dynamically render options based on selected gender */}
                    {formState.gender === "men" &&
                      mensCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    {formState.gender === "women" &&
                      womensCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    {formState.gender === "unisex" &&
                      unisexCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold">
                    Description
                  </label>
                  <RichTextEditor
                    value={formState.description}
                    onChange={(value) => setFormState(prev => ({ ...prev, description: value }))}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      placeholder="S, M, L, XL"
                      className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors rounded-lg"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-3 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formState.isFeatured}
                    onChange={(event) =>
                      setFormState((previous) => ({
                        ...previous,
                        isFeatured: event.target.checked,
                      }))
                    }
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
                    onChange={handleInputChange}
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
                      onChange={handleFileChange}
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
                  onClick={resetModal}
                  className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingProduct
                    ? "Saving..."
                    : editingProductId
                      ? "Update Product"
                      : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-xl overflow-hidden p-6 text-center shadow-2xl">
            <Trash2 size={48} className="mx-auto mb-6 text-red-500/80" />
            <h3 className="text-xl font-display font-bold mb-2">
              Delete Product?
            </h3>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors border border-white/10 hover:bg-white/5 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                disabled={isDeleting}
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest border border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
