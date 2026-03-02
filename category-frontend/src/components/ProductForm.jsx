import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCategories } from "../services/categoryService";

/**
 * ProductForm - handles both create and update via react-hook-form.
 * Props:
 *   onSubmit     : async (data, setError) => Promise<void>
 *   defaultValues: product object when editing, undefined when creating
 *   isEditing    : boolean
 */
export default function ProductForm({ onSubmit, defaultValues, isEditing }) {
    const [categories, setCategories] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting, isDirty },
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            productName: "",
            description: "",
            price: "",
            sku: "",
            categoryId: "",
            inventoryCount: "",
        },
    });

    // Fetch active categories for dropdown
    useEffect(() => {
        getCategories(0, 100, "active")
            .then((res) => {
                const items = res.data?.data?.content ?? [];
                setCategories(items);
            })
            .catch(() => setCategories([]));
    }, []);

    useEffect(() => {
        if (isEditing && defaultValues) {
            reset({
                productName: defaultValues.productName ?? "",
                description: defaultValues.description ?? "",
                price: defaultValues.price ?? "",
                sku: defaultValues.sku ?? "",
                categoryId: defaultValues.categoryId ?? "",
                inventoryCount: defaultValues.inventoryCount ?? "",
            });
        } else {
            reset({
                productName: "",
                description: "",
                price: "",
                sku: "",
                categoryId: "",
                inventoryCount: "",
            });
        }
    }, [isEditing, defaultValues, reset]);

    const processSubmit = async (values) => {
        const trimmed = {
            productName: values.productName.trim(),
            description: values.description.trim(),
            price: parseFloat(values.price),
            sku: values.sku.trim(),
            categoryId: parseInt(values.categoryId, 10),
            inventoryCount: parseInt(values.inventoryCount, 10),
        };
        await onSubmit(trimmed, setError);
    };

    const isUpdateDisabled = isEditing && !isDirty;

    const inputClass = (hasError) =>
        [
            "w-full px-3 py-2 rounded-lg border text-sm",
            "text-[var(--text-primary)] bg-[var(--bg-surface)]",
            "placeholder-[var(--text-muted)]",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]",
            hasError
                ? "border-[var(--danger)]"
                : "border-[var(--border-soft)] hover:border-[var(--border-hover)]",
        ].join(" ");

    return (
        <form onSubmit={handleSubmit(processSubmit)} noValidate>
            {/* Product Name */}
            <div className="mb-4">
                <label
                    htmlFor="productName"
                    className="block mb-1.5 text-sm font-medium text-[var(--text-secondary)]"
                >
                    Product Name <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                    id="productName"
                    type="text"
                    placeholder="e.g. Wireless Headphones"
                    className={inputClass(!!errors.productName)}
                    {...register("productName", {
                        required: "Product name is required",
                        maxLength: {
                            value: 150,
                            message: "Product name must be 150 characters or fewer",
                        },
                    })}
                />
                {errors.productName && (
                    <p className="mt-1 text-xs text-[var(--danger)]">
                        {errors.productName.message}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="mb-4">
                <label
                    htmlFor="description"
                    className="block mb-1.5 text-sm font-medium text-[var(--text-secondary)]"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    rows={3}
                    placeholder="Short description…"
                    className={inputClass(!!errors.description)}
                    style={{ resize: "vertical" }}
                    {...register("description", {
                        maxLength: {
                            value: 500,
                            message: "Description must be 500 characters or fewer",
                        },
                    })}
                />
                {errors.description && (
                    <p className="mt-1 text-xs text-[var(--danger)]">
                        {errors.description.message}
                    </p>
                )}
            </div>

            {/* Price + SKU row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label
                        htmlFor="price"
                        className="block mb-1.5 text-sm font-medium text-[var(--text-secondary)]"
                    >
                        Price <span className="text-[var(--danger)]">*</span>
                    </label>
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        className={inputClass(!!errors.price)}
                        {...register("price", {
                            required: "Price is required",
                            min: { value: 0.01, message: "Price must be at least 0.01" },
                        })}
                    />
                    {errors.price && (
                        <p className="mt-1 text-xs text-[var(--danger)]">
                            {errors.price.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="sku"
                        className="block mb-1.5 text-sm font-medium text-[var(--text-secondary)]"
                    >
                        SKU <span className="text-[var(--danger)]">*</span>
                    </label>
                    <input
                        id="sku"
                        type="text"
                        placeholder="e.g. WH-001"
                        className={inputClass(!!errors.sku)}
                        {...register("sku", {
                            required: "SKU is required",
                            maxLength: { value: 50, message: "SKU must be 50 characters or fewer" },
                        })}
                    />
                    {errors.sku && (
                        <p className="mt-1 text-xs text-[var(--danger)]">
                            {errors.sku.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Category + Inventory row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label
                        htmlFor="categoryId"
                        className="block mb-1.5 text-sm font-medium text-[var(--text-secondary)]"
                    >
                        Category <span className="text-[var(--danger)]">*</span>
                    </label>
                    <select
                        id="categoryId"
                        className={inputClass(!!errors.categoryId)}
                        {...register("categoryId", {
                            required: "Category is required",
                        })}
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.categoryId} value={cat.categoryId}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && (
                        <p className="mt-1 text-xs text-[var(--danger)]">
                            {errors.categoryId.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="inventoryCount"
                        className="block mb-1.5 text-sm font-medium text-[var(--text-secondary)]"
                    >
                        Inventory <span className="text-[var(--danger)]">*</span>
                    </label>
                    <input
                        id="inventoryCount"
                        type="number"
                        min="0"
                        placeholder="0"
                        className={inputClass(!!errors.inventoryCount)}
                        {...register("inventoryCount", {
                            required: "Inventory count is required",
                            min: { value: 0, message: "Inventory cannot be negative" },
                        })}
                    />
                    {errors.inventoryCount && (
                        <p className="mt-1 text-xs text-[var(--danger)]">
                            {errors.inventoryCount.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || isUpdateDisabled}
                    aria-label={isEditing ? "Update product" : "Create product"}
                    className={[
                        "px-5 py-2 rounded-lg text-sm font-semibold text-white",
                        "transition-colors duration-150",
                        isSubmitting || isUpdateDisabled
                            ? "bg-[var(--text-muted)] cursor-not-allowed opacity-60"
                            : "bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)]",
                    ].join(" ")}
                >
                    {isSubmitting
                        ? isEditing ? "Updating…" : "Creating…"
                        : isEditing ? "Update Product" : "Create Product"}
                </button>
            </div>
        </form>
    );
}
