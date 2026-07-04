import { ReactNode, useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, Settings, LogOut, Store, Menu, X } from 'lucide-react';
import { PageProps } from '@/types';

const menu = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin', match: /^\/admin$/ },
    { label: 'Products', icon: Package, href: '/admin/products', match: /^\/admin\/products/ },
    { label: 'Categories', icon: Tags, href: '/admin/categories', match: /^\/admin\/categories/ },
    { label: 'Orders', icon: ShoppingCart, href: '/admin/orders', match: /^\/admin\/orders/ },
    { label: 'Customers', icon: Users, href: '/admin/customers', match: /^\/admin\/customers/ },
    { label: 'Settings', icon: Settings, href: '/admin/settings', match: /^\/admin\/settings/ },
];

export default function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
    const { url, props } = usePage<PageProps>();
    const flash = props.flash;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);

    useEffect(() => {
        if (flash.success) {
            setNotice(flash.success);
            const t = setTimeout(() => setNotice(null), 3500);
            return () => clearTimeout(t);
        }
    }, [flash.success]);

    const path = url.split('?')[0];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row w-full">
            {/* Mobile top bar */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tighter uppercase italic">Admin Panel</h2>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-600">
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0`}>
                <div className="hidden md:block p-6">
                    <Link href="/" className="block" aria-label="INSKYLXSTR — Home">
                        <img src="/images/logo-brand.png" alt="INSKYLXSTR" className="h-16 w-auto object-contain" />
                    </Link>
                    <p className="text-xs text-gray-400 mt-2">Admin Panel</p>
                </div>
                <nav className="space-y-1 p-4 md:p-3">
                    {menu.map((item) => {
                        const Icon = item.icon;
                        const active = item.match.test(path);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-sm transition-colors ${active ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                    <div className="pt-4 mt-4 border-t border-gray-100 space-y-1">
                        <Link href="/" className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-sm text-gray-600 hover:bg-gray-100">
                            <Store className="w-5 h-5" />
                            <span>View Store</span>
                        </Link>
                        <button onClick={() => router.post('/logout')} className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-sm text-red-600 hover:bg-gray-100">
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col min-h-0">
                <header className="hidden md:flex items-center px-6 md:px-10 py-4 bg-white border-b border-gray-200">
                    <div className="flex items-center text-sm">
                        <span className="text-gray-500 font-medium">Admin Panel</span>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-gray-900 font-bold">{title}</span>
                    </div>
                </header>

                {notice && (
                    <div className="mx-6 md:mx-10 mt-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                        {notice}
                    </div>
                )}

                <div className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}
