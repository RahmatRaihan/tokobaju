import { Head, useForm, router } from '@inertiajs/react';
import { Trash2, Upload } from 'lucide-react';
import { FormEvent, useState, useRef } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface ImageItem {
    id: number;
    url: string;
    caption: string | null;
}

interface Props {
    settings: {
        store_name: string | null;
        store_email: string | null;
        whatsapp_number: string | null;
        instagram_url: string | null;
        hero_heading: string | null;
        hero_subheading: string | null;
        hero_image_url: string | null;
        about_text: string | null;
        about_image_url: string | null;
    };
    community_photos: ImageItem[];
    gallery_images: ImageItem[];
}

function ImageManager({ title, items, storeUrl, destroyBase }: { title: string; items: ImageItem[]; storeUrl: string; destroyBase: string }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const upload = (file: File) => {
        setUploading(true);
        router.post(storeUrl, { image: file }, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => {
                setUploading(false);
                if (fileRef.current) fileRef.current.value = '';
            },
        });
    };

    const destroy = (id: number) => {
        if (confirm('Remove this image?')) router.delete(`${destroyBase}/${id}`, { preserveScroll: true });
    };

    return (
        <div>
            <h3 className="text-lg font-bold mb-3">{title}</h3>
            <div className="flex flex-wrap gap-3 mb-4">
                {items.map((item) => (
                    <div key={item.id} className="relative w-24 h-24">
                        <img src={item.url} alt="" className="w-24 h-24 object-cover rounded-lg border border-gray-200 bg-gray-50" />
                        <button type="button" onClick={() => destroy(item.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                {items.length === 0 && <p className="text-sm text-gray-400">No images yet.</p>}
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black cursor-pointer">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading…' : 'Upload image'}
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
                />
            </label>
        </div>
    );
}

export default function Settings({ settings, community_photos, gallery_images }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        store_name: string;
        store_email: string;
        whatsapp_number: string;
        instagram_url: string;
        hero_heading: string;
        hero_subheading: string;
        about_text: string;
        hero_image: File | null;
        about_image: File | null;
    }>({
        store_name: settings.store_name ?? '',
        store_email: settings.store_email ?? '',
        whatsapp_number: settings.whatsapp_number ?? '',
        instagram_url: settings.instagram_url ?? '',
        hero_heading: settings.hero_heading ?? '',
        hero_subheading: settings.hero_subheading ?? '',
        about_text: settings.about_text ?? '',
        hero_image: null,
        about_image: null,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/settings', { forceFormData: true, preserveScroll: true });
    };

    return (
        <AdminLayout title="Settings">
            <Head title="Admin — Settings" />
            <div className="space-y-6 max-w-3xl">
                <h2 className="text-2xl font-bold">Website Settings</h2>

                <form onSubmit={submit} className="space-y-6">
                    {/* Store info */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
                        <h3 className="text-lg font-bold">Store Info</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Store Name</label>
                                <input value={data.store_name} onChange={(e) => setData('store_name', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Store Email</label>
                                <input value={data.store_email} onChange={(e) => setData('store_email', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
                                {errors.store_email && <p className="text-red-500 text-xs mt-1">{errors.store_email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Number</label>
                                <input value={data.whatsapp_number} onChange={(e) => setData('whatsapp_number', e.target.value)} placeholder="62812xxxxxxx" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
                                <p className="text-xs text-gray-400 mt-1">International format (62…). Leading 0 auto-converts to 62.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Instagram URL</label>
                                <input value={data.instagram_url} onChange={(e) => setData('instagram_url', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
                            </div>
                        </div>
                    </div>

                    {/* Hero */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
                        <h3 className="text-lg font-bold">Hero Banner</h3>
                        {settings.hero_image_url && <img src={settings.hero_image_url} alt="Hero" className="w-full h-40 object-cover rounded-lg border border-gray-200" />}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Banner Image</label>
                            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setData('hero_image', e.target.files?.[0] ?? null)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Heading</label>
                            <input value={data.hero_heading} onChange={(e) => setData('hero_heading', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Subheading</label>
                            <input value={data.hero_subheading} onChange={(e) => setData('hero_subheading', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
                        </div>
                    </div>

                    {/* About */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
                        <h3 className="text-lg font-bold">About Page</h3>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">About Text</label>
                            <textarea value={data.about_text} onChange={(e) => setData('about_text', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-40 focus:outline-none focus:border-black" placeholder="Paragraphs separated by blank lines…" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">About Image</label>
                            {settings.about_image_url && <img src={settings.about_image_url} alt="About" className="mb-2 w-full sm:max-w-sm h-40 object-cover rounded-lg border border-gray-200" />}
                            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setData('about_image', e.target.files?.[0] ?? null)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                            <p className="text-xs text-gray-400 mt-1">Shown on the public About page. Leave empty to keep the current image.</p>
                            {errors.about_image && <p className="text-red-500 text-xs mt-1">{errors.about_image}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={processing} className="bg-black text-white px-6 py-2 text-sm font-bold rounded-sm hover:bg-gray-800 disabled:opacity-60">
                            {processing ? 'Saving…' : 'Save Settings'}
                        </button>
                    </div>
                </form>

                {/* Community & Gallery (managed independently of the settings form) */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-8">
                    <ImageManager title="Community Photos" items={community_photos} storeUrl="/admin/community-photos" destroyBase="/admin/community-photos" />
                    <hr className="border-gray-100" />
                    <ImageManager title="Gallery Images" items={gallery_images} storeUrl="/admin/gallery-images" destroyBase="/admin/gallery-images" />
                </div>
            </div>
        </AdminLayout>
    );
}
