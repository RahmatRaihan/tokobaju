export interface AuthUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: 'admin' | 'customer';
    is_admin: boolean;
}

export interface SiteInfo {
    store_name: string | null;
    whatsapp_number: string | null;
    instagram_url: string | null;
    store_email: string | null;
}

export interface PageProps {
    auth: { user: AuthUser | null };
    site: SiteInfo;
    flash: {
        success: string | null;
        error: string | null;
        checkout?: { order_number: string; whatsapp_url: string } | null;
    };
    [key: string]: unknown;
}

export interface ProductCardData {
    id: number;
    name: string;
    slug: string;
    price: number;
    price_formatted: string;
    image: string | null;
    is_featured: boolean;
    is_sold_out: boolean;
    category: string | null;
}

export interface ProductVariantData {
    id: number;
    size: string | null;
    color: string | null;
    label: string;
    price: number;
    price_formatted: string;
    stock: number;
    is_sold_out: boolean;
}

export interface ProductImageData {
    id: number;
    url: string;
    alt: string | null;
    is_primary: boolean;
}

export interface ProductDetailData extends ProductCardData {
    description: string | null;
    size_chart_url: string | null;
    images: ProductImageData[];
    variants: ProductVariantData[];
}

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export interface CartItem {
    variant_id: number;
    product_id: number;
    product_slug: string;
    name: string;
    variant_label: string;
    unit_price: number;
    image: string | null;
    quantity: number;
    max_stock: number;
}
