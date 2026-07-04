import { motion } from 'motion/react';
import { ProductCardData } from '@/types';

interface ProductCardProps {
    product: ProductCardData;
    onQuickView: () => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
    return (
        <motion.div
            className="group cursor-pointer flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div
                className="relative aspect-[4/5] mb-4 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-4 group-hover:shadow-md transition-shadow"
                onClick={onQuickView}
            >
                {product.image && (
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-black text-xs font-bold px-4 py-2 uppercase tracking-widest rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Quick View
                    </span>
                </div>
            </div>

            <div className="flex flex-col space-y-1 items-start w-full">
                <h3 className="text-sm font-bold tracking-tight uppercase">{product.name}</h3>
                <p className="text-sm font-medium">{product.price_formatted}</p>

                {product.is_sold_out ? (
                    <div className="mt-2 bg-[#2c2f33] text-white text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-[2px]">
                        SOLD OUT
                    </div>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onQuickView();
                        }}
                        className="mt-3 w-full bg-black text-white text-xs font-bold py-2.5 px-4 uppercase tracking-wider hover:bg-gray-800 transition-colors rounded"
                    >
                        Add to Cart
                    </button>
                )}
            </div>
        </motion.div>
    );
}
