import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div
                className="bg-[#060608] w-full max-w-md rounded-2xl border border-[#00f0ff]/20 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,240,255,0.1)] overflow-hidden animate-in fade-in zoom-in duration-300 relative group"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Subtle Neural Gradient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,240,255,0.08),transparent_70%)] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/40 to-transparent opacity-50" />

                <div className="flex items-center justify-between p-6 pb-2 relative z-10">
                    <h2 className="text-white text-[10px] font-black uppercase tracking-[0.4em] opacity-80">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-[#4e5058] hover:text-[#00f0ff] transition-all hover:rotate-90 duration-300 p-2 rounded-xl hover:bg-[#00f0ff]/5 border border-transparent hover:border-[#00f0ff]/10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 pt-2 relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
};
