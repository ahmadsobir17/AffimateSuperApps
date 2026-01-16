'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: LucideIcon;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export function Input({ label, icon: Icon, className = '', ...props }: InputProps) {
    return (
        <div>
            {label && (
                <label className="block text-xs text-slate-400 mb-2">{label}</label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                )}
                <input
                    className={`w-full px-4 py-2.5 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white 
            transition-all focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 
            placeholder:text-slate-500 ${Icon ? 'pl-10' : ''} ${className}`}
                    {...props}
                />
            </div>
        </div>
    );
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
    return (
        <div>
            {label && (
                <label className="block text-xs text-slate-400 mb-1">{label}</label>
            )}
            <textarea
                className={`w-full px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white 
          transition-all focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 
          placeholder:text-slate-500 resize-none ${className}`}
                {...props}
            />
        </div>
    );
}
