import { Head } from '@inertiajs/react';
import { motion } from 'motion/react';
import StoreLayout from '@/layouts/StoreLayout';

interface CommunityProps {
    photos: { id: number; url: string; caption: string | null }[];
}

export default function Community({ photos }: CommunityProps) {
    return (
        <StoreLayout>
            <Head title="Community" />
            <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-12">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Community</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        See how our community styles INSKYLXSTR. Tag us on Instagram to be featured.
                    </p>
                </div>

                {photos.length === 0 ? (
                    <p className="text-center text-gray-400 py-24">No community photos yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {photos.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                className="relative aspect-[3/4] overflow-hidden rounded-xl group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.caption ?? 'Community Style'}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-bold tracking-wider uppercase text-sm border border-white px-4 py-2 backdrop-blur-sm">
                                        {photo.caption ?? 'Shop the Look'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
