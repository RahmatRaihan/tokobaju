import { Instagram } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

// TikTok isn't in lucide-react, so use an inline SVG.
function TikTokIcon({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M16.6 5.82a4.28 4.28 0 0 1-1.01-2.82h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1-2.59-2.59 2.59 2.59 0 0 1 3.4-2.46V9.7a5.68 5.68 0 0 0-6.49 5.61A5.68 5.68 0 0 0 9.91 21a5.68 5.68 0 0 0 5.68-5.68V9.01a7.35 7.35 0 0 0 4.29 1.37V7.3a4.28 4.28 0 0 1-3.28-1.48z" />
        </svg>
    );
}

export function Footer() {
    const { site } = usePage<PageProps>().props;
    const tiktokUrl = 'https://www.tiktok.com/@inskylxstr';

    return (
        <footer className="bg-white border-t border-gray-100 py-12 lg:py-16 mt-auto">
            <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {/* Brand/About */}
                    <div>
                        <img src="/images/logo-brand.png" alt="INSKYLXSTR" className="h-20 w-auto object-contain mb-4" />
                        <p className="text-sm text-gray-500 mb-6 font-medium">
                            Bridging contemporary street culture and timeless design aesthetics.
                        </p>
                        <div className="flex space-x-4">
                            <a href={site.instagram_url || 'https://instagram.com/inskylxstr'} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-black transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href={tiktokUrl} target="_blank" rel="noreferrer" aria-label="TikTok" className="text-gray-400 hover:text-black transition-colors">
                                <TikTokIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-gray-900">Shop</h4>
                        <ul className="space-y-3">
                            <li><Link href="/catalog" className="text-sm text-gray-500 hover:text-black font-medium transition-colors">All Products</Link></li>
                            <li><Link href="/community" className="text-sm text-gray-500 hover:text-black font-medium transition-colors">Community</Link></li>
                            <li><Link href="/gallery" className="text-sm text-gray-500 hover:text-black font-medium transition-colors">Gallery</Link></li>
                            <li><Link href="/about" className="text-sm text-gray-500 hover:text-black font-medium transition-colors">About</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-gray-900">Support</h4>
                        <ul className="space-y-3">
                            <li><Link href="/help" className="text-sm text-gray-500 hover:text-black font-medium transition-colors">Help Center</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 font-medium">
                    <p>&copy; {new Date().getFullYear()} INSKYLXSTR. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
