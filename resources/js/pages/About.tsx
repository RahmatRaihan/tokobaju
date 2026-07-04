import { Head } from '@inertiajs/react';
import { motion } from 'motion/react';
import StoreLayout from '@/layouts/StoreLayout';

interface AboutProps {
    about: { text: string | null; email: string | null; image: string | null };
}

const DEFAULT_ABOUT_IMAGE =
    'https://images.unsplash.com/photo-1558769132-cb1fac08c04b?auto=format&fit=crop&q=80&w=1000';

export default function About({ about }: AboutProps) {
    const paragraphs = (about.text ?? '').split('\n').filter((p) => p.trim() !== '');

    return (
        <StoreLayout>
            <Head title="About" />
            <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-12 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <img
                            src={about.image ?? DEFAULT_ABOUT_IMAGE}
                            alt="About INSKYLXSTR"
                            className="w-full h-auto object-cover rounded-sm mix-blend-multiply"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic">
                            About<br />INSKYLXSTR
                        </h1>

                        <div className="space-y-4 text-gray-700 leading-relaxed font-medium">
                            {paragraphs.length > 0 ? (
                                paragraphs.map((p, i) => <p key={i}>{p}</p>)
                            ) : (
                                <p>INSKYLXSTR — streetwear from Jakarta.</p>
                            )}
                        </div>

                        <div className="pt-6">
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Contact</h3>
                            {about.email && <p className="text-gray-600 font-medium">{about.email}</p>}
                            <p className="text-gray-600 font-medium">Jakarta, Indonesia</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </StoreLayout>
    );
}
