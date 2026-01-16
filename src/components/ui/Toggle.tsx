'use client';

import { motion } from 'framer-motion';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    color?: 'red' | 'green';
    disabled?: boolean;
}

export default function Toggle({ checked, onChange, label, description, color = 'red', disabled = false }: ToggleProps) {
    const colorClasses = {
        red: 'peer-checked:bg-red-600',
        green: 'peer-checked:bg-green-600',
    };

    return (
        <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
            <motion.div
                className={`w-9 h-5 bg-slate-700 rounded-full peer ${colorClasses[color]}
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
          after:bg-white after:border-gray-300 after:border after:rounded-full 
          after:h-4 after:w-4 after:transition-all
          peer-checked:after:translate-x-full peer-checked:after:border-white`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            />
            {(label || description) && (
                <div className="ml-2">
                    {label && <span className="text-xs font-medium text-slate-300">{label}</span>}
                    {description && <p className="text-[9px] text-slate-400">{description}</p>}
                </div>
            )}
        </label>
    );
}
