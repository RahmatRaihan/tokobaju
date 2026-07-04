import { Head } from '@inertiajs/react';
import { motion } from 'motion/react';
import StoreLayout from '@/layouts/StoreLayout';

interface GalleryProps {
    images: { id: number; url: string; caption: string | null }[];
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="group relative overflow-hidden rounded-sm bg-gray-50 aspect-[3/4]">
                                    <img
                                        src={image.url}
                                        alt={image.caption ?? `Gallery image ${index + 1}`}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
