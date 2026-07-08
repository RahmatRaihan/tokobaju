import { Head } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';

export default function Terms() {
    return (
        <StoreLayout>
            <Head title="Terms of Service" />
            <div className="max-w-3xl w-full mx-auto px-4 lg:px-8 py-12 lg:py-16">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Terms of Service</h1>
                <p className="text-gray-400 text-sm mb-10">Terakhir diperbarui: {new Date().getFullYear()}</p>

                <div className="prose prose-sm max-w-none text-gray-600 space-y-6 leading-relaxed">
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">1. Penerimaan Ketentuan</h2>
                        <p>Dengan mengakses dan menggunakan website INSKYLXSTR, kamu menyetujui untuk terikat pada ketentuan layanan ini. Jika kamu tidak setuju, mohon untuk tidak menggunakan layanan kami.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">2. Produk & Harga</h2>
                        <p>Kami berusaha menampilkan produk dan harga seakurat mungkin. Harga dapat berubah sewaktu-waktu tanpa pemberitahuan. Ketersediaan stok mengikuti kondisi terkini di sistem kami.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">3. Pemesanan</h2>
                        <p>Pesanan dianggap sah setelah dikonfirmasi melalui WhatsApp dan pembayaran diterima. Kami berhak menolak atau membatalkan pesanan dalam kondisi tertentu, misalnya stok habis atau kesalahan harga.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">4. Akun Pengguna</h2>
                        <p>Kamu bertanggung jawab menjaga kerahasiaan akun dan kata sandimu. Setiap aktivitas yang terjadi melalui akunmu menjadi tanggung jawabmu.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">5. Kekayaan Intelektual</h2>
                        <p>Seluruh konten di website ini, termasuk logo, desain produk, dan gambar, adalah milik INSKYLXSTR dan dilindungi hukum. Dilarang menggunakan tanpa izin tertulis.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">6. Perubahan Ketentuan</h2>
                        <p>Kami dapat memperbarui ketentuan ini sewaktu-waktu. Perubahan berlaku segera setelah dipublikasikan di halaman ini. Penggunaan berkelanjutan berarti kamu menyetujui ketentuan yang diperbarui.</p>
                    </section>
                </div>
            </div>
        </StoreLayout>
    );
}
