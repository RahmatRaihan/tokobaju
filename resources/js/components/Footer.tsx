import { Instagram, Twitter, Facebook } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export function Footer() {
    const { site } = usePage<PageProps>().props;

    return (
        <footer className="bg-white border-t border-gray-100 py-12 lg:py-16 mt-auto">
            <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand/About */}
                    <div className="col-span-1 md:col-span-1">
                        <img src="/images/logo-brand.png" alt="INSKYLXSTR" className="h-20 w-auto object-contain mb-4" />
                        <p className="text-sm text-gray-500 mb-6 font-medium">
                            Bridging contemporary street culture and timeless design aesthetics.
                        </p>
                        <div className="flex space-x-4">
                            <a href={site.instagram_url || '#'} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-black transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-black transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-gray-900">Shop</h4>
                        <ul className="space-y-3">
                            <li><Link href="/catalog" className="text-sm text-gray-500 hover:text-black font-medium transition-colors">All Products</Link></li>
                            <li><Link href="/community" className="text-sm text-gray-500 hover:text-black font-medium transition-colors">Community</Link></li>
                            <li><Link href="/gallery" className="text-sm text-gray-500 hover:text-black font-medium transition-colors">Gallery</Link></li>
                            <li><Link href="/about" className="text-sm text-gray-500 hover:text-black font-medium transition-colors">About</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-gray-900">Support</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm text-gray-500 hover:text-black font-medium transition-colors">FAQ</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-black font-medium transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-black font-medium transition-colors">Contact Us</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-black font-medium transition-colors">Size Guide</a></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-1">
                        <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-gray-900">Newsletter</h4>
                        <p className="text-sm text-gray-500 mb-4 font-medium">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-black transition-colors bg-gray-50"
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-black text-white text-sm font-bold tracking-wider rounded-sm hover:bg-gray-900 transition-colors uppercase"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 font-medium">
                    <p>&copy; {new Date().getFullYear()} INSKYLXSTR. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
