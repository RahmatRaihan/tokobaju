import { Head, Link, useForm, router } from '@inertiajs/react';
import { Plus, Trash2, X } from 'lucide-react';
import { FormEvent } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { useConfirm } from '@/components/ConfirmDialog';

interface VariantForm {
    id?: number;
    size: string;
    color: string;
    sku: string;
    price: string;
    stock: string;
    is_active: boolean;
}

interface ExistingImage {
    id: number;
    url: string;
    is_primary: boolean;
}

interface ProductData {
    id: number;
    name: string;
    description: string | null;
    price: number;
    category_id: number | null;
    is_featured: boolean;
    is_active: boolean;
    variants: {
        id: number;
        size: string | null;
        color: string | null;
        sku: string | null;
        price: number | null;
        stock: number;
        is_active: boolean;
    }[];
    images: ExistingImage[];
    size_chart_url: string | null;
}

interface Props {
    product: ProductData | null;
    categories: { id: number; name: string }[];
}

export default function Form({ product, categories }: Props) {
    const isEdit = !!product;
    const confirm = useConfirm();

    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        description: string;
        price: string;
        category_id: string;
        is_featured: boolean;
        is_active: boolean;
        variants: VariantForm[];
        images: File[];
        size_chart: File | null;
        remove_size_chart: boolean;
        _method?: string;
    }>({
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product ? String(product.price) : '',
        category_id: product?.category_id ? String(product.category_id) : '',
        is_featured: product?.is_featured ?? false,
        is_active: product?.is_active ?? true,
        variants: product?.variants.length
            ? product.variants.map((v) => ({
                  id: v.id,
                  size: v.size ?? '',
                  color: v.color ?? '',
                  sku: v.sku ?? '',
                  price: v.price != null ? String(v.price) : '',
                  stock: String(v.stock),
                  is_active: v.is_active,
              }))
            : [{ size: '', color: '', sku: '', price: '', stock: '0', is_active: true }],
        images: [],
        size_chart: null,
        remove_size_chart: false,
        ...(isEdit ? { _method: 'put' } : {}),
    });

    const addVariant = () =>
        setData('variants', [...data.variants, { size: '', color: '', sku: '', price: '', stock: '0', is_active: true }]);

    const removeVariant = (index: number) =>
        setData('variants', data.variants.filter((_, i) => i !== index));

    const updateVariant = (index: number, patch: Partial<VariantForm>) =>
        setData('variants', data.variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const url = isEdit ? `/admin/products/${product!.id}` : '/admin/products';
        post(url, { forceFormData: true });
    };

    const deleteImage = async (imageId: number) => {
        if (await confirm({ message: 'Remove this image?', danger: true, confirmText: 'Remove' })) {
            router.delete(`/admin/products/${product!.id}/images/${imageId}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Product' : 'Add Product'}>
            <Head title={isEdit ? 'Admin — Edit Product' : 'Admin — Add Product'} />
            <div className="space-y-6 max-w-3xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
                    <Link href="/admin/products" className="text-sm font-bold text-gray-500 hover:text-black">← Back</Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Basic info */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                            <input value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" required />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Price (Rp)</label>
                                <input type="number" min="0" value={data.price} onChange={(e) => setData('price', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" placeholder="549000" required />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-bold text-gray-700">Category</label>
                                    <Link href="/admin/categories" className="text-xs text-gray-500 underline hover:text-black">Manage categories</Link>
                                </div>
                                <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black">
                                    <option value="">— None —</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                            <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-24 focus:outline-none focus:border-black" />
                        </div>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 text-sm font-medium">
                                <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} />
                                Featured
                            </label>
                            <label className="flex items-center gap-2 text-sm font-medium">
                                <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                                Active (visible in store)
                            </label>
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold">Variants & Stock</h3>
                                <p className="text-xs text-gray-500">Leave size/color blank for a single default variant.</p>
                            </div>
                            <button type="button" onClick={addVariant} className="text-sm font-bold flex items-center gap-1 text-gray-600 hover:text-black">
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>
                        {typeof errors.variants === 'string' && <p className="text-red-500 text-xs">{errors.variants}</p>}
                        <div className="space-y-3">
                            {data.variants.map((v, i) => (
                                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                                    <input value={v.size} onChange={(e) => updateVariant(i, { size: e.target.value })} placeholder="Size" className="col-span-2 border border-gray-300 rounded px-2 py-1.5 text-sm" />
                                    <input value={v.color} onChange={(e) => updateVariant(i, { color: e.target.value })} placeholder="Color" className="col-span-3 border border-gray-300 rounded px-2 py-1.5 text-sm" />
                                    <input type="number" min="0" value={v.price} onChange={(e) => updateVariant(i, { price: e.target.value })} placeholder="Price*" className="col-span-3 border border-gray-300 rounded px-2 py-1.5 text-sm" />
                                    <input type="number" min="0" value={v.stock} onChange={(e) => updateVariant(i, { stock: e.target.value })} placeholder="Stock" className="col-span-2 border border-gray-300 rounded px-2 py-1.5 text-sm" required />
                                    <button type="button" onClick={() => removeVariant(i)} disabled={data.variants.length === 1} className="col-span-2 text-red-500 hover:text-red-700 disabled:opacity-30 flex justify-center">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400">* Variant price is optional — leave blank to use the product price.</p>
                    </div>

                    {/* Images */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
                        <h3 className="font-bold">Images</h3>

                        {isEdit && product!.images.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {product!.images.map((img) => (
                                    <div key={img.id} className="relative w-24 h-24">
                                        <img src={img.url} alt="" className="w-24 h-24 object-cover rounded-lg border border-gray-200 bg-gray-50" />
                                        {img.is_primary && <span className="absolute top-1 left-1 text-[9px] bg-black text-white px-1 rounded">Primary</span>}
                                        <button type="button" onClick={() => deleteImage(img.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Upload images (jpg, png, webp — max 10MB each)</label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={(e) => setData('images', Array.from(e.target.files ?? []))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                            {data.images.length > 0 && <p className="text-xs text-gray-500 mt-1">{data.images.length} file(s) selected</p>}
                        </div>
                    </div>

                    {/* Size Chart (per product) */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
                        <div>
                            <h3 className="font-bold">Size Chart</h3>
                            <p className="text-xs text-gray-500">Shown to customers via the "Size Guide" link on this product's page.</p>
                        </div>

                        {isEdit && product!.size_chart_url && !data.remove_size_chart && (
                            <div className="relative w-40">
                                <img src={product!.size_chart_url} alt="Size chart" className="w-40 h-auto rounded-lg border border-gray-200 bg-gray-50" />
                                <button
                                    type="button"
                                    onClick={() => setData('remove_size_chart', true)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    title="Remove size chart"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        {isEdit && product!.size_chart_url && data.remove_size_chart && (
                            <p className="text-xs text-red-500">
                                Size chart will be removed on save.{' '}
                                <button type="button" onClick={() => setData('remove_size_chart', false)} className="underline font-bold">Undo</button>
                            </p>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                {isEdit && product!.size_chart_url ? 'Replace size chart' : 'Upload size chart'} (jpg, png, webp — max 10MB)
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => setData('size_chart', e.target.files?.[0] ?? null)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                            {errors.size_chart && <p className="text-red-500 text-xs mt-1">{errors.size_chart}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href="/admin/products" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-black">Cancel</Link>
                        <button type="submit" disabled={processing} className="bg-black text-white px-6 py-2 text-sm font-bold rounded-sm hover:bg-gray-800 disabled:opacity-60">
                            {processing ? 'Saving…' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
