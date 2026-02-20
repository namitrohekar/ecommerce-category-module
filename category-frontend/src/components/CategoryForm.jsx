import { useEffect } from "react";
import { useForm } from "react-hook-form";

/**
 * CategoryForm - handles both create and update via react-hook-form.
 * Props:
 *   onSubmit     : async (data, setError) => Promise<void>
 *   defaultValues: category object when editing, undefined when creating
 *   isEditing    : boolean
 */
export default function CategoryForm({ onSubmit, defaultValues, isEditing }) {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting, isDirty },
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            categoryName: "",
            description: "",
        },
    });

    /* Populate form when switching to edit mode */
    useEffect(() => {
        if (isEditing && defaultValues) {
            reset({
                categoryName: defaultValues.categoryName ?? "",
                description: defaultValues.description ?? "",
            });
        } else {
            reset({ categoryName: "", description: "" });
        }
    }, [isEditing, defaultValues, reset]);

    const processSubmit = async (values) => {
        const trimmed = {
            categoryName: values.categoryName.trim(),
            description: values.description.trim(),
        };
        await onSubmit(trimmed, setError);
    };

    const isUpdateDisabled = isEditing && !isDirty;

    /* Base input class - border flips to --danger on error */
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
            {/* Category Name */}
            <div className="mb-4">
                <label
                    htmlFor="categoryName"
                    className="block mb-1.5 text-sm font-medium text-[var(--text-secondary)]"
                >
                    Category Name <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                    id="categoryName"
                    type="text"
                    placeholder="e.g. Electronics"
                    className={inputClass(!!errors.categoryName)}
                    {...register("categoryName", {
                        required: "Category name is required",
                        minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                        },
                    })}
                />
                {errors.categoryName && (
                    <p className="mt-1 text-xs text-[var(--danger)]">
                        {errors.categoryName.message}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="mb-6">
                <label
                    htmlFor="description"
                    className="block mb-1.5 text-sm font-medium text-[var(--text-secondary)]"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    rows={3}
                    placeholder="Optional short description…"
                    className={inputClass(!!errors.description)}
                    style={{ resize: "vertical" }}
                    {...register("description", {
                        maxLength: {
                            value: 300,
                            message: "Description must be 300 characters or fewer",
                        },
                    })}
                />
                {errors.description && (
                    <p className="mt-1 text-xs text-[var(--danger)]">
                        {errors.description.message}
                    </p>
                )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || isUpdateDisabled}
                    aria-label={isEditing ? "Update category" : "Create category"}
                    className={[
                        "px-5 py-2 rounded-lg text-sm font-semibold text-white",
                        "transition-colors duration-150",
                        isSubmitting || isUpdateDisabled
                            ? "bg-[var(--text-muted)] cursor-not-allowed opacity-60"
                            : "bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)]",
                    ].join(" ")}
                >
                    {isSubmitting
                        ? isEditing
                            ? "Updating…"
                            : "Creating…"
                        : isEditing
                            ? "Update Category"
                            : "Create Category"}
                </button>
            </div>
        </form>
    );
}
