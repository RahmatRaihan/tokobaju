import { ShoppingCart, User, Menu, Settings, LogOut, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useCart } from '@/lib/cart';
import { useUi } from '@/lib/ui';

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const { auth } = usePage<PageProps>().props;
    const { component } = usePage();
    const { count } = useCart();
    const { openCart } = useUi();

    const logout = () => router.post('/logout');

    // On the landing page only: as soon as the user starts scrolling, fade the
    // navbar out entirely (not tied to scroll amount). It reappears at the top.
    const isLanding = component === 'Home';
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        if (!isLanding) {
            setHidden(false);
            return;
        }
        const onScroll = () => {
            const y =
                window.scrollY ||
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;
            setHidden(y > 10); // any scroll past the very top hides it
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('scroll', onScroll, { passive: true, capture: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('scroll', onScroll, { capture: true } as EventListenerOptions);
        };
    }, [isLanding]);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-500 ${
                hidden ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
            }`}
        >
            <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 flex items-center justify-between h-24">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link href="/" className="block" aria-label="INSKYLXSTR — Home">
                        <img
                            src="/images/logo-brand.png"
                            alt="INSKYLXSTR"
                            className="h-[120px] md:h-[150px] w-auto max-w-[190px] md:max-w-[280px] object-contain transition-all"
                        />
                    </Link>
                </div>

                {/* Desktop Navigation — centered independently of logo/actions width */}
                <nav className="hidden lg:flex items-center space-x-10 absolute left-1/2 -translate-x-1/2">
                    <Link href="/catalog" className="text-sm font-bold tracking-wide hover:opacity-70 transition-opacity">CATALOG</Link>
                    <Link href="/community" className="text-sm font-bold tracking-wide hover:opacity-70 transition-opacity">COMMUNITY</Link>
                    <Link href="/gallery" className="text-sm font-bold tracking-wide hover:opacity-70 transition-opacity">GALLERY</Link>
                    <Link href="/about" className="text-sm font-bold tracking-wide hover:opacity-70 transition-opacity">ABOUT</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-6">
                    <button onClick={openCart} className="flex items-center space-x-2 hover:opacity-70 transition-opacity">
                        <span className="text-sm font-bold hidden sm:inline-block">CART</span>
                        <div className="relative">
                            <ShoppingCart className="w-5 h-5" />
                            {count > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {count}
                                </span>
                            )}
                        </div>
                    </button>

                    {auth.user ? (
                        <div className="hidden sm:block relative">
                            <button
                                onClick={() => setIsAccountOpen((v) => !v)}
                                className="flex items-center space-x-2 hover:opacity-70 transition-opacity"
                            >
                                <User className="w-5 h-5" />
                                <span className="text-sm font-bold max-w-[120px] truncate">{auth.user.name}</span>
                            </button>
                            {isAccountOpen && (
                                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                                    <Link
                                        href="/my-orders"
                                        className="flex items-center space-x-2 px-4 py-2 text-sm font-bold hover:bg-gray-50"
                                    >
                                        <Package className="w-4 h-4" />
                                        <span>Pesanan Saya</span>
                                    </Link>
                                    {auth.user.is_admin && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center space-x-2 px-4 py-2 text-sm font-bold hover:bg-gray-50"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Admin Panel</span>
                                        </Link>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-gray-50"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="hidden sm:block hover:opacity-70 transition-opacity" title="Login">
                            <User className="w-5 h-5" />
                        </Link>
                    )}

                    {/* Mobile menu button */}
                    <button className="lg:hidden p-2 -mr-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg absolute w-full left-0">
                    <Link href="/catalog" className="block w-full text-left text-sm font-bold tracking-wide py-2 hover:bg-gray-50">CATALOG</Link>
                    <Link href="/community" className="block w-full text-left text-sm font-bold tracking-wide py-2 hover:bg-gray-50">COMMUNITY</Link>
                    <Link href="/gallery" className="block w-full text-left text-sm font-bold tracking-wide py-2 hover:bg-gray-50">GALLERY</Link>
                    <Link href="/about" className="block w-full text-left text-sm font-bold tracking-wide py-2 hover:bg-gray-50">ABOUT</Link>
                    {auth.user ? (
                        <>
                            <Link href="/my-orders" className="block w-full text-left text-sm font-bold tracking-wide py-2 hover:bg-gray-50">PESANAN SAYA</Link>
                            {auth.user.is_admin && (
                                <Link href="/admin" className="block w-full text-left text-sm font-bold tracking-wide py-2 hover:bg-gray-50 text-blue-600">ADMIN PANEL</Link>
                            )}
                            <button onClick={logout} className="block w-full text-left text-sm font-bold tracking-wide py-2 hover:bg-gray-50 text-red-600">LOGOUT</button>
                        </>
                    ) : (
                        <Link href="/login" className="block w-full text-left text-sm font-bold tracking-wide py-2 hover:bg-gray-50">LOGIN</Link>
                    )}
                </div>
            )}
        </header>
    );
}
