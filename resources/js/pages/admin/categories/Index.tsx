import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { useConfirm } from '@/components/ConfirmDialog';

interface CategoryRow {
    id: number;
    name: string;
    slug: string;
    products_count: number;
}

interface Props {
    categories: CategoryRow[];
}

export default function Index({ categories }: Props) {
    const confirm = useConfirm();
    // Add form
    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });

    // Inline edit state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editError, setEditError] = useState<string | null>(null);

    const submitAdd = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/categories', { preserveScroll: true, onSuccess: () => reset('name') });
    };

    const startEdit = (c: CategoryRow) => {
        setEditingId(c.id);
        setEditName(c.name);
        setEditError(null);
    };

    const saveEdit = (id: number) => {
        router.put(`/admin/categories/${id}`, { name: editName }, {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
            onError: (errs) => setEditError((errs.name as string) ?? 'Failed to update.'),
        });
    };

    const destroy = async (c: CategoryRow) => {
        const msg = c.products_count > 0
            ? `Delete "${c.name}"? ${c.products_count} product(s) will become uncategorized (not deleted).`
            : `Delete "${c.name}"?`;
        if (await confirm({ message: msg, danger: true })) {
            router.delete(`/admin/categories/${c.id}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Categories">
            <Head title="Admin — Categories" />
            <div className="space-y-6 max-w-3xl">
                <h2 className="text-2xl font-bold">Categories</h2>

                {/* Add new */}
                <form onSubmit={submitAdd} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Add a category</label>
                    <div className="flex gap-3">
                        <input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Jacket, Cap, Pants…"
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                            required
                        />
                        <button type="submit" disabled={processing} className="bg-black text-white px-4 py-2 text-sm font-bold rounded-sm flex items-center gap-2 hover:bg-gray-800 disabled:opacity-60">
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </form>

                {/* List */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[480px]">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Products</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {categories.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No categories yet. Add one above.</td></tr>
                            ) : (
                                categories.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-bold">
                                            {editingId === c.id ? (
                                                <div>
                                                    <input
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(c.id)}
                                                        className="border border-gray-300 rounded px-2 py-1 text-sm w-48 focus:outline-none focus:border-black"
                                                        autoFocus
                                                    />
                                                    {editError && <p className="text-red-500 text-xs mt-1">{editError}</p>}
                                                </div>
                                            ) : (
                                                c.name
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{c.slug}</td>
                                        <td className="px-6 py-4">{c.products_count}</td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            {editingId === c.id ? (
                                                <>
                                                    <button onClick={() => saveEdit(c.id)} className="text-green-600 hover:text-green-800 p-2" title="Save"><Check className="w-4 h-4" /></button>
                                                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-black p-2" title="Cancel"><X className="w-4 h-4" /></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => startEdit(c)} className="text-gray-500 hover:text-black p-2" title="Rename"><Pencil className="w-4 h-4" /></button>
                                                    <button onClick={() => destroy(c)} className="text-red-500 hover:text-red-700 p-2" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <p className="text-xs text-gray-400">
                    Deleting a category doesn't delete its products — they simply become uncategorized and can be reassigned when editing the product.
                </p>
            </div>
        </AdminLayout>
    );
}
