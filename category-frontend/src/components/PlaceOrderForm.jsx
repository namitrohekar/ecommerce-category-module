import { useState, useMemo, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";

export default function PlaceOrderForm({ products, onSubmit, isSubmitting, preselectedProductId = null }) {
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            shippingAddress: "",
            items: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    // Auto-add pre-selected product once after products load (Buy Now flow)
    const preselectedAdded = useRef(false);
    useEffect(() => {
        if (preselectedAdded.current) return;
        if (!preselectedProductId || products.length === 0) return;

        const exists = products.find(
            (p) => p.productId === Number(preselectedProductId)
        );
        if (exists && exists.inventoryCount > 0) {
            append({ productId: String(preselectedProductId), quantity: 1 });
            preselectedAdded.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products]);

    const watchItems = watch("items");

    // Live order total
    const cartTotal = useMemo(() => {
        let total = 0;
        watchItems.forEach((item) => {
            if (item.productId && item.quantity) {
                const prod = products.find(
                    (p) => p.productId === parseInt(item.productId)
                );
                if (prod) {
                    total += Number(prod.price) * Number(item.quantity);
                }
            }
        });
        const tax = total * 0.08;
        const shipping = total > 0 ? 50 : 0;
        return { subtotal: total, tax, shipping, grandTotal: total + tax + shipping };
    }, [watchItems, products]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Shipping Address */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Shipping Address <span className="text-[var(--danger)]">*</span>
                </label>
                <textarea
                    {...register("shippingAddress", { required: "Shipping address is required" })}
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-1 bg-[var(--bg-surface)] ${
                        errors.shippingAddress
                            ? "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger-soft)]"
                            : "border-[var(--border-soft)] focus:border-[var(--accent-primary)] focus:ring-[var(--focus-ring)] text-[var(--text-primary)]"
                    }`}
                    placeholder="123 Main St, City, Country"
                />
                {errors.shippingAddress && (
                    <p className="mt-1 text-xs text-[var(--danger)]">{errors.shippingAddress.message}</p>
                )}
            </div>

            {/* Order Items */}
            <div className="border-t border-[var(--border-soft)] pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold text-[var(--text-primary)]">Order Items</h3>
                    <button
                        type="button"
                        onClick={() => append({ productId: "", quantity: 1 })}
                        className="flex items-center gap-1 text-sm font-medium text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors"
                    >
                        <Plus size={16} /> Add Item
                    </button>
                </div>

                {errors.items?.root && (
                    <p className="mt-1 mb-3 text-xs text-[var(--danger)]">{errors.items.root.message}</p>
                )}
                {fields.length === 0 && (
                    <p className="text-sm text-[var(--text-muted)] italic mb-4">
                        No items added yet. Click <strong>Add Item</strong> or go back and use <strong>Buy Now</strong> on a product.
                    </p>
                )}

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="flex gap-4 items-start bg-[var(--bg-subtle)] p-4 rounded-xl border border-[var(--border-soft)]"
                        >
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                                    Product
                                </label>
                                <select
                                    {...register(`items.${index}.productId`, { required: "Product required" })}
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] text-[var(--text-primary)]"
                                >
                                    <option value="">Select a product...</option>
                                    {products.map((p) => (
                                        <option
                                            key={p.productId}
                                            value={p.productId}
                                            disabled={p.inventoryCount < 1}
                                        >
                                            {p.productName} (&#8377;{Number(p.price).toFixed(2)})
                                            {p.inventoryCount < 1 ? " — Out of Stock" : ""}
                                        </option>
                                    ))}
                                </select>
                                {errors.items?.[index]?.productId && (
                                    <p className="mt-1 text-xs text-[var(--danger)]">
                                        {errors.items[index].productId.message}
                                    </p>
                                )}
                            </div>

                            <div className="w-24 shrink-0">
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    {...register(`items.${index}.quantity`, {
                                        required: "Qty required",
                                        min: { value: 1, message: "Min 1" },
                                        valueAsNumber: true,
                                    })}
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] text-[var(--text-primary)] text-center"
                                />
                                {errors.items?.[index]?.quantity && (
                                    <p className="mt-1 text-xs text-[var(--danger)]">
                                        {errors.items[index].quantity.message}
                                    </p>
                                )}
                            </div>

                            <div className="pt-6">
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Summary */}
            {fields.length > 0 && (
                <div className="bg-[var(--bg-subtle)] p-4 rounded-xl border border-[var(--border-soft)]">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-[var(--text-secondary)]">
                            <span>Subtotal</span>
                            <span>&#8377;{cartTotal.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[var(--text-secondary)]">
                            <span>Tax (8%)</span>
                            <span>&#8377;{cartTotal.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[var(--text-secondary)]">
                            <span>Shipping</span>
                            <span>&#8377;{cartTotal.shipping.toFixed(2)}</span>
                        </div>
                        <div className="pt-2 border-t border-[var(--border-soft)] flex justify-between font-bold text-base text-[var(--text-primary)]">
                            <span>Total</span>
                            <span>&#8377;{cartTotal.grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end border-t border-[var(--border-soft)] pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting || fields.length === 0}
                    className="px-6 py-2 rounded-lg text-sm font-medium text-white shadow-sm bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent focus-teal"
                >
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                </button>
            </div>
        </form>
    );
}
