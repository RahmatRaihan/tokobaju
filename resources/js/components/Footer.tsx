import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

const paymentMethods = ['QRIS', 'OVO', 'ALFAMART', 'MANDIRI', 'BRI', 'BNI', 'VISA', 'MASTERCARD'];

export function Footer() {
    const { site } = usePage<PageProps>().props;
    const instagramUrl = site.instagram_url || 'https://instagram.com/inskylxstr';
    const tiktokUrl = 'https://www.tiktok.com/@inskylxstr';
    const waNumber = site.whatsapp_number?.replace(/\D/g, '');
    const contactHref = waNumber ? `https://wa.me/${waNumber}` : '/help';

    return (
        <footer className="bg-black text-white mt-auto">
            <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 lg:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 lg:gap-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <img src="/images/logo-brand.png" alt="INSKYLXSTR" className="h-10 md:h-16 w-auto object-contain invert mb-3 md:mb-6" />
                        <p className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wide max-w-[220px]">
                            The New Standard of Exclusive Collection.
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 className="text-xs md:text-sm font-bold tracking-widest uppercase mb-3 md:mb-5 text-white">Explore</h4>
                        <ul className="space-y-2 md:space-y-3">
                            <li><Link href="/catalog" className="text-xs md:text-sm text-gray-400 hover:text-white font-bold uppercase tracking-wide transition-colors">Catalog</Link></li>
                            <li><Link href="/community" className="text-xs md:text-sm text-gray-400 hover:text-white font-bold uppercase tracking-wide transition-colors">Community</Link></li>
                            <li><Link href="/gallery" className="text-xs md:text-sm text-gray-400 hover:text-white font-bold uppercase tracking-wide transition-colors">Gallery</Link></li>
                            <li><Link href="/about" className="text-xs md:text-sm text-gray-400 hover:text-white font-bold uppercase tracking-wide transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-xs md:text-sm font-bold tracking-widest uppercase mb-3 md:mb-5 text-white">Support</h4>
                        <ul className="space-y-2 md:space-y-3">
                            <li><Link href="/help" className="text-xs md:text-sm text-gray-400 hover:text-white font-bold uppercase tracking-wide transition-colors">Help Center</Link></li>
                            <li><a href={contactHref} target="_blank" rel="noreferrer" className="text-xs md:text-sm text-gray-400 hover:text-white font-bold uppercase tracking-wide transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="text-xs md:text-sm font-bold tracking-widest uppercase mb-3 md:mb-5 text-white">Socials</h4>
                        <ul className="space-y-2 md:space-y-3">
                            <li><a href={instagramUrl} target="_blank" rel="noreferrer" className="text-xs md:text-sm text-gray-400 hover:text-white font-bold uppercase tracking-wide transition-colors">Instagram</a></li>
                            <li><a href={tiktokUrl} target="_blank" rel="noreferrer" className="text-xs md:text-sm text-gray-400 hover:text-white font-bold uppercase tracking-wide transition-colors">TikTok</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest">
                            &copy; {new Date().getFullYear()} INSKYLXSTR INC. All Rights Reserved.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/privacy" className="text-[11px] text-gray-600 hover:text-white uppercase tracking-wider transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="text-[11px] text-gray-600 hover:text-white uppercase tracking-wider transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {paymentMethods.map((m) => (
                            <span key={m} className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">{m}</span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
