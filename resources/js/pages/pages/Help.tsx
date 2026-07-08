import { Head, usePage } from '@inertiajs/react';
import { MessageCircle, HelpCircle, Truck, RefreshCw, Mail } from 'lucide-react';
import StoreLayout from '@/layouts/StoreLayout';
import { PageProps } from '@/types';

const faqs = [
    {
        q: 'Bagaimana cara memesan?',
        a: 'Pilih produk, tentukan ukuran/varian, tambahkan ke keranjang, lalu klik Checkout. Isi data pengiriman dan kamu akan diarahkan ke WhatsApp untuk konfirmasi pesanan dengan admin kami.',
    },
    {
        q: 'Metode pembayaran apa yang tersedia?',
        a: 'Pembayaran dikonfirmasi langsung via WhatsApp dengan admin. Kami akan memberikan detail rekening/metode pembayaran setelah pesanan dikonfirmasi.',
    },
    {
        q: 'Bagaimana cara melacak pesanan saya?',
        a: 'Setelah checkout dan login, buka menu akun → "Pesanan Saya" untuk melihat status dan progres pesananmu (Dipesan → Diproses → Dikirim → Selesai).',
    },
    {
        q: 'Apakah ukuran bisa dikonsultasikan?',
        a: 'Bisa. Setiap produk memiliki "Size Guide" (jika tersedia). Kamu juga bisa tanya langsung via WhatsApp sebelum membeli.',
    },
];

export default function Help() {
    const { site } = usePage<PageProps>().props;
    const waNumber = site.whatsapp_number?.replace(/\D/g, '');
    const waUrl = waNumber ? `https://wa.me/${waNumber}` : '#';

    return (
        <StoreLayout>
            <Head title="Help Center" />
            <div className="max-w-3xl w-full mx-auto px-4 lg:px-8 py-12 lg:py-16">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Help Center</h1>
                <p className="text-gray-500 mb-12">Semua yang perlu kamu tahu tentang belanja di INSKYLXSTR.</p>

                {/* FAQ */}
                <section className="mb-14">
                    <div className="flex items-center gap-2 mb-6">
                        <HelpCircle className="w-5 h-5" />
                        <h2 className="text-xl font-black uppercase tracking-tight">FAQ</h2>
                    </div>
                    <div className="space-y-6">
                        {faqs.map((f, i) => (
                            <div key={i} className="border-b border-gray-100 pb-6">
                                <h3 className="font-bold text-gray-900 mb-2">{f.q}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Shipping Policy */}
                <section className="mb-14">
                    <div className="flex items-center gap-2 mb-6">
                        <Truck className="w-5 h-5" />
                        <h2 className="text-xl font-black uppercase tracking-tight">Shipping Policy</h2>
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                        <p>Pesanan diproses dalam 1–3 hari kerja setelah pembayaran dikonfirmasi. Estimasi pengiriman menyesuaikan lokasi dan kurir yang dipilih.</p>
                        <p>Ongkir dihitung saat konfirmasi via WhatsApp berdasarkan alamat pengiriman kamu. Nomor resi akan dibagikan setelah paket dikirim.</p>
                    </div>
                </section>

                {/* Returns & Exchanges */}
                <section className="mb-14">
                    <div className="flex items-center gap-2 mb-6">
                        <RefreshCw className="w-5 h-5" />
                        <h2 className="text-xl font-black uppercase tracking-tight">Returns &amp; Exchanges</h2>
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                        <p>Penukaran ukuran dapat dilakukan dalam 3 hari setelah barang diterima, selama produk masih dalam kondisi baru, belum dicuci, dan label utuh.</p>
                        <p>Produk yang rusak/cacat dari kami akan diganti tanpa biaya. Hubungi kami via WhatsApp dengan menyertakan nomor pesanan dan foto produk.</p>
                    </div>
                </section>

                {/* Contact Us */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Mail className="w-5 h-5" />
                        <h2 className="text-xl font-black uppercase tracking-tight">Contact Us</h2>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Ada pertanyaan lain? Tim kami siap membantu.</p>
                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                        {site.store_email && <p>Email: {site.store_email}</p>}
                        <p>Lokasi: Pontianak, Indonesia</p>
                    </div>
                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl uppercase tracking-wide text-sm hover:bg-[#1da851] transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" /> Chat via WhatsApp
                    </a>
                </section>
            </div>
        </StoreLayout>
    );
}
