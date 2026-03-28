"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { Product } from "@/types";
import { DeleteConfirmModal } from "./components/delete-confirm-modal";
import { ProductFormModal, ProductFormState } from "./components/product-form-modal";
import { ProductsFilter } from "./components/products-filter";
import { ProductsTable } from "./components/products-table";

const initialFormState: ProductFormState = {
  name: "",
  category: "",
  gender: "unisex",
  price: "",
  stock: "",
  description: "",
  colors: "",
  colorImages: {},
  sizes: "",
  imageUrls: "",
  isFeatured: false,
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
    let initialColorImages: Record<string, string> = {};
    if (product.colorImages) {
      initialColorImages = product.colorImages.reduce((acc, ci) => {
        acc[ci.color] = ci.url;
        return acc;
      }, {} as Record<string, string>);
    }

    setFormState({
      name: product.name || "",
      category: product.category || "Tops",
      gender: product.gender || "unisex",
      price: product.price?.toString() || "0",
      stock: product.stock?.toString() || "0",
      description: product.description || "",
      colors: product.colors?.join(", ") || "",
      colorImages: initialColorImages,
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

      const parsedColors = formState.colors
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const colorImagesArray = parsedColors
        .map((color) => {
          const url = formState.colorImages?.[color];
          if (url?.trim()) {
            return { color, url: url.trim() };
          }
          return null;
        })
        .filter(Boolean);

      const payload: any = {
        name: formState.name.trim(),
        description: formState.description.trim(),
        price: Number(formState.price),
        category: formState.category,
        gender: formState.gender,
        stock: Number(formState.stock),
        colors: parsedColors,
        colorImages: colorImagesArray,
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
      <ProductsFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        featuredFilter={featuredFilter}
        setFeaturedFilter={setFeaturedFilter}
        categoryOptions={categoryOptions}
      />

      {/* Products Table */}
      <ProductsTable
        isLoading={isLoadingProducts}
        products={filteredProducts}
        onEdit={handleEditClick}
        onDelete={setDeletingProductId}
      />

      {errorMessage && !isAddModalOpen && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}

      {/* Add Product Modal */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        isEditing={!!editingProductId}
        isSaving={isSavingProduct}
        formState={formState}
        errorMessage={errorMessage}
        selectedFiles={selectedFiles}
        selectedFilePreviews={selectedFilePreviews}
        onClose={resetModal}
        onSubmit={handleCreateProduct}
        onInputChange={handleInputChange}
        onDescriptionChange={(value) => setFormState(prev => ({ ...prev, description: value }))}
        onColorImageChange={(color, url) => setFormState(prev => ({ ...prev, colorImages: { ...prev.colorImages, [color]: url } }))}
        onCheckboxChange={(event) =>
          setFormState((previous) => ({
            ...previous,
            isFeatured: event.target.checked,
          }))
        }
        onFileChange={handleFileChange}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingProductId}
        isDeleting={isDeleting}
        onClose={() => setDeletingProductId(null)}
        onConfirm={confirmDeleteProduct}
      />
    </div>
  );
}
