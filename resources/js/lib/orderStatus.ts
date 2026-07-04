// Shared order status metadata used across customer order pages.

export const STATUS_LABELS: Record<string, string> = {
    pending: 'Menunggu Konfirmasi',
    processing: 'Diproses',
    shipped: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

export const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

// The happy-path progress steps (cancelled is handled separately).
export const PROGRESS_STEPS = ['pending', 'processing', 'shipped', 'completed'] as const;

export function statusLabel(status: string): string {
    return STATUS_LABELS[status] ?? status;
}
