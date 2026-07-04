import { Eye, EyeOff } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export function PasswordInput({ className = '', ...props }: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                {...props}
                type={visible ? 'text' : 'password'}
                className={`w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors ${className}`}
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? 'Hide password' : 'Show password'}
                title={visible ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-black transition-colors"
                tabIndex={-1}
            >
                {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
        </div>
    );
}
