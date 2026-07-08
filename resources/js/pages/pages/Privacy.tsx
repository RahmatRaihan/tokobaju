import { Head } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';

export default function Privacy() {
    return (
        <StoreLayout>
            <Head title="Privacy Policy" />
            <div className="max-w-3xl w-full mx-auto px-4 lg:px-8 py-12 lg:py-16">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Privacy Policy</h1>
                <p className="text-gray-400 text-sm mb-10">Terakhir diperbarui: {new Date().getFullYear()}</p>

                <div className="prose prose-sm max-w-none text-gray-600 space-y-6 leading-relaxed">
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">1. Informasi yang Kami Kumpulkan</h2>
                        <p>Kami mengumpulkan data yang kamu berikan saat membuat akun dan melakukan pemesanan, seperti nama, email, nomor telepon, dan alamat pengiriman. Data ini hanya digunakan untuk memproses pesanan dan berkomunikasi denganmu.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">2. Penggunaan Data</h2>
                        <p>Informasi kamu digunakan untuk memproses pesanan, mengirim update status, memberikan layanan pelanggan, dan (jika kamu setuju) mengirim informasi promosi. Kami tidak menjual data pribadimu kepada pihak ketiga.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">3. Keamanan</h2>
                        <p>Kata sandi disimpan dalam bentuk terenkripsi dan kami menerapkan langkah keamanan yang wajar untuk melindungi data kamu. Namun, tidak ada metode transmisi data melalui internet yang 100% aman.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">4. Cookie</h2>
                        <p>Kami menggunakan cookie untuk menjaga sesi login dan meningkatkan pengalaman berbelanja. Kamu dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa fitur mungkin tidak berfungsi optimal.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">5. Hak Kamu</h2>
                        <p>Kamu berhak meminta akses, koreksi, atau penghapusan data pribadimu. Hubungi kami kapan saja untuk permintaan terkait data melalui halaman Help Center.</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">6. Kontak</h2>
                        <p>Jika ada pertanyaan mengenai kebijakan privasi ini, silakan hubungi kami melalui WhatsApp atau email yang tertera di halaman Help Center.</p>
                    </section>
                </div>
            </div>
        </StoreLayout>
    );
}
