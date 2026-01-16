'use client';

import { SelectOption } from '@/types';
import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[];
    label?: string;
}

export default function Select({ options, label, className = '', ...props }: SelectProps) {
    return (
        <div>
            {label && (
                <label className="block text-xs text-slate-400 mb-1">{label}</label>
            )}
            <select
                className={`w-full px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white 
          transition-all focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
