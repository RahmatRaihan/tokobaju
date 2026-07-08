import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import StoreLayout from '@/layouts/StoreLayout';

interface CommunityPhoto {
    id: number;
    url: string;
    caption: string | null;
    product_slug: string | null;
    product_name: string | null;
}

interface CommunityProps {
    photos: CommunityPhoto[];
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
                    /* Masonry (Pinterest-style): CSS columns keep each photo's natural height */
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
                        {photos.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                className="relative mb-4 overflow-hidden rounded-xl group break-inside-avoid"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: (index % 8) * 0.04 }}
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.caption ?? 'Community Style'}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                                    {photo.caption && (
                                        <p className="text-white text-sm font-medium text-center line-clamp-2">{photo.caption}</p>
                                    )}
                                    {photo.product_slug ? (
                                        <Link
                                            href={`/products/${photo.product_slug}`}
                                            className="inline-flex items-center gap-2 bg-white text-black font-bold tracking-wider uppercase text-xs px-4 py-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            Shop the Look
                                        </Link>
                                    ) : (
                                        <span className="text-white/80 font-bold tracking-wider uppercase text-xs border border-white/60 px-4 py-2 rounded-full backdrop-blur-sm">
                                            INSKYLXSTR
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
