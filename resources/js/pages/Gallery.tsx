import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import StoreLayout from '@/layouts/StoreLayout';

interface GalleryImage {
    id: number;
    url: string;
    caption: string | null;
    product_slug: string | null;
    product_name: string | null;
}

interface GalleryProps {
    images: GalleryImage[];
}

export default function Gallery({ images }: GalleryProps) {
    return (
        <StoreLayout>
            <Head title="Gallery" />
            <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-12 lg:py-20">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic mb-4"
                    >
                        Gallery
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 font-medium"
                    >
                        Explore our latest lookbook and seasonal campaigns.
                    </motion.p>
                </div>

                {images.length === 0 ? (
                    <p className="text-center text-gray-400 py-24">No gallery images yet.</p>
                ) : (
                    /* Masonry (Pinterest-style): CSS columns keep each image's natural height */
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                        {images.map((image, index) => (
                            <motion.div
                                key={image.id}
                                className="mb-4 break-inside-avoid"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (index % 8) * 0.04 }}
                            >
                                <div className="group relative overflow-hidden rounded-xl bg-gray-50">
                                    <img
                                        src={image.url}
                                        alt={image.caption ?? `Gallery image ${index + 1}`}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                                        {image.caption && (
                                            <p className="text-white text-sm font-medium text-center line-clamp-2">{image.caption}</p>
                                        )}
                                        {image.product_slug ? (
                                            <Link
                                                href={`/products/${image.product_slug}`}
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
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
