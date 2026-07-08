import { Head } from '@inertiajs/react';
import { motion } from 'motion/react';
import StoreLayout from '@/layouts/StoreLayout';

interface AboutProps {
    about: { text: string | null; image: string | null; image2: string | null };
}

const DEFAULT_ABOUT_IMAGE =
    'https://images.unsplash.com/photo-1558769132-cb1fac08c04b?auto=format&fit=crop&q=80&w=1000';

export default function About({ about }: AboutProps) {
    const paragraphs = (about.text ?? '').split('\n').filter((p) => p.trim() !== '');

    return (
        <StoreLayout>
            <Head title="About" />

            {/* Section 1 — intro */}
            <section className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 pt-16 lg:pt-24 pb-12 lg:pb-20 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl sm:text-5xl lg:text-7xl font-black uppercase tracking-[0.12em] lg:tracking-[0.18em] leading-tight"
                >
                    Born Free Built Different
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-8 lg:mt-12 max-w-2xl mx-auto text-sm lg:text-base text-gray-500 leading-relaxed"
                >
                    Lahir dari jantung Pontianak, INHALE SKY, EXHALE STAR bukan sekadar brand — ini cara berdiri di dunia.
                    Kami tumbuh dari kultur jalanan yang hidup, untuk generasi yang bergerak bebas tapi tahu siapa dirinya.
                    Kebebasan yang punya nama. Bebas yang punya wajah.
                </motion.p>
            </section>

            {/* Section 2 — existing about block */}
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
                    </motion.div>
                </div>
            </div>

            {/* Section 3 — quality */}
            <section className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-12 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-[0.08em]">
                            Uncompromising Quality
                        </h2>
                        <p className="text-sm lg:text-base text-gray-600 leading-loose">
                            Inhale Sky, Exhale Star — menghirup semua kemungkinan yang ada, lalu melepaskan versi terbaik
                            dirimu ke dunia. Untuk mereka yang tetap mendongak meski langit terasa rendah. Untuk yang
                            berani bermimpi di tengah kebisingan dunia.
                        </p>
                        <p className="text-sm lg:text-base text-gray-600 leading-loose">
                            Minimalis dalam tampilan. Dalam dalam makna. Premium dalam setiap jahitan. Karena malam paling
                            gelap pun masih punya bintang — dan kamu salah satunya.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="bg-gray-50 rounded-sm p-6 lg:p-10"
                    >
                        <img
                            src={about.image2 ?? about.image ?? DEFAULT_ABOUT_IMAGE}
                            alt="INSKYLXSTR quality"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-auto object-contain"
                        />
                    </motion.div>
                </div>
            </section>
        </StoreLayout>
    );
}
