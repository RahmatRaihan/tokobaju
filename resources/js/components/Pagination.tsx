import { Link } from '@inertiajs/react';

interface PaginationProps {
    links: { url: string | null; label: string; active: boolean }[];
}

export function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <nav className="flex items-center justify-center gap-1 mt-12 flex-wrap">
            {links.map((link, i) => {
                const label = link.label
                    .replace('&laquo; Previous', '‹')
                    .replace('Next &raquo;', '›')
                    .replace('pagination.previous', '‹')
                    .replace('pagination.next', '›');

                if (!link.url) {
                    return (
                        <span
                            key={i}
                            className="px-3 py-2 text-sm text-gray-300 cursor-default select-none"
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }

                return (
                    <Link
                        key={i}
                        href={link.url}
                        preserveScroll
                        className={`px-3 py-2 text-sm font-bold rounded transition-colors ${
                            link.active ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </nav>
    );
}
