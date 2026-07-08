import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import StoreLayout from '@/layouts/StoreLayout';

const faqs = [
    {
        q: 'Bagaimana cara merawat produk INSR?',
        a: 'Cuci menggunakan air dingin dengan warna senada. Hindari penggunaan pemutih. Sangat disarankan untuk tidak menyetrika langsung di atas area sablon atau detail logo. Balik pakaian sebelum disetrika.',
    },
    {
        q: 'Metode pembayaran apa saja yang diterima?',
        a: 'Saat ini, proses konfirmasi pesanan dan instruksi pembayaran dialihkan secara langsung dan aman melalui WhatsApp Admin kami. Setelah Anda melakukan checkout, sistem akan otomatis mengarahkan Anda ke chat WhatsApp beserta detail pesanan Anda.',
    },
    {
        q: 'Bagaimana panduan ukuran (size chart) produk?',
        a: 'Mayoritas koleksi INSR menggunakan potongan boxy oversize fit. Kami menyarankan Anda untuk memilih ukuran reguler yang biasa Anda pakai untuk mendapatkan tampilan oversize yang ideal, atau turun satu ukuran (downsize) jika ingin lebih pas di badan. Detail ukuran sentimeter ada di setiap halaman produk.',
    },
    {
        q: 'Apakah item yang habis akan di-restock?',
        a: 'Kami menjaga eksklusivitas merek kami. Mayoritas koleksi dirilis secara terbatas (limited drop) dan tidak akan diproduksi ulang setelah habis terjual. Pantau terus Instagram kami untuk info rilis terbaru.',
    },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="border-b-2 border-black pb-4 mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tight">{children}</h2>
        </div>
    );
}

export default function Help() {
    const [open, setOpen] = useState<number | null>(0);

    // Scroll to #contact if the page is opened with that hash (e.g. from the
    // footer "Contact Us" link), accounting for the fixed navbar.
    useEffect(() => {
        if (window.location.hash === '#contact') {
            requestAnimationFrame(() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }, []);

    return (
        <StoreLayout>
            <Head title="Support Center" />
            <div className="max-w-3xl w-full mx-auto px-4 lg:px-8 py-14 lg:py-20">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter">Support Center</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs sm:text-sm mt-3">
                        Everything you need to know.
                    </p>
                </div>

                {/* FAQ (accordion) */}
                <section className="mb-20">
                    <SectionTitle>FAQ</SectionTitle>
                    <div className="divide-y divide-gray-200 border-b border-gray-200">
                        {faqs.map((f, i) => {
                            const isOpen = open === i;
                            return (
                                <div key={i}>
                                    <button
                                        onClick={() => setOpen(isOpen ? null : i)}
                                        className="w-full flex items-center justify-between gap-4 py-5 text-left"
                                    >
                                        <span className="font-bold uppercase tracking-wide text-sm text-gray-900">{f.q}</span>
                                        <ChevronDown className={`w-5 h-5 flex-shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="text-sm text-gray-500 leading-relaxed pb-5">{f.a}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Shipping Policy */}
                <section className="mb-20">
                    <SectionTitle>Shipping Policy</SectionTitle>
                    <div className="text-sm text-gray-500 leading-relaxed space-y-4">
                        <p>Semua pesanan diproses dan dikirim dalam waktu 1–2 hari kerja (Senin – Jumat, tidak termasuk hari libur nasional). Pesanan dengan konfirmasi pembayaran sebelum pukul 15.00 WIB akan diusahakan untuk dikirim pada hari yang sama.</p>
                        <p>Kami mempercayakan pengiriman domestik menggunakan layanan <strong className="text-gray-700">JNE, JNT, dan SPX</strong> untuk memastikan keamanan dan kecepatan pengiriman paket eksklusif Anda.</p>
                        <p>Setelah pesanan dikirim, Anda akan menerima email berisi nomor resi pelacakan.</p>
                    </div>
                </section>

                {/* Returns & Exchanges */}
                <section className="mb-20">
                    <SectionTitle>Returns &amp; Exchanges</SectionTitle>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">All Sales Are Final.</p>
                    <div className="text-sm text-gray-500 leading-relaxed space-y-4">
                        <p>Untuk menjaga kualitas dan standar kebersihan tertinggi, kami tidak menerima pengembalian dana (<em>refund</em>) atau penukaran ukuran (<em>size exchange</em>) jika pembeli salah memilih ukuran.</p>
                        <p>Pengembalian atau penukaran hanya berlaku apabila terdapat cacat produksi dari pihak INSR atau terjadi kesalahan pengiriman produk. Klaim maksimal <strong className="text-gray-700">1×24 jam</strong> setelah status resi menunjukkan barang telah diterima, dan <strong className="text-gray-700">wajib</strong> menyertakan video unboxing tanpa jeda.</p>
                    </div>
                </section>

                {/* Contact Us */}
                <section id="contact" className="scroll-mt-32">
                    <SectionTitle>Contact Us</SectionTitle>
                    <div className="bg-gray-50 rounded-lg p-6 lg:p-8">
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                            Customer Service kami beroperasi pada hari Senin – Jumat, 09.00 – 17.00 WIB. Silakan hubungi kami untuk pertanyaan lebih lanjut terkait pesanan atau produk.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-1">WhatsApp</p>
                                <a href="https://wa.me/628136592030" target="_blank" rel="noreferrer" className="text-sm text-gray-600 hover:text-black transition-colors">+628136592030</a>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-1">Email</p>
                                <a href="mailto:inskylxstr3@gmail.com" className="text-sm text-gray-600 hover:text-black transition-colors">inskylxstr3@gmail.com</a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </StoreLayout>
    );
}
