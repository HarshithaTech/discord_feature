import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MoreHorizontal, Plus } from 'lucide-react';

export const CalendarWidget: React.FC = () => {
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="w-full max-w-[620px] bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800 text-sm">Today, Mar 6</span>
                    <ChevronDown size={14} className="text-gray-400" />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                        <button className="px-3 py-1 text-xs font-medium bg-white shadow-sm rounded-md text-gray-700">Today</button>
                        <div className="flex px-1 items-center gap-1">
                            <button className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors">
                                <ChevronLeft size={14} />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors">
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-gray-50 rounded text-gray-400 transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors">
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                <div className="relative mb-6">
                    <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center">
                        <div className="relative">
                            <Umbrella className="w-20 h-20 text-[#D1D5DB] animate-bounce-slow" />
                        </div>
                    </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">No events scheduled.</h3>
                <button className="text-[#0E71EB] text-sm font-bold flex items-center gap-1 hover:underline transition-all">
                    <Plus size={16} strokeWidth={3} />
                    Schedule an event
                </button>
            </div>

            <div className="p-4 border-t border-gray-50 flex items-center justify-between text-gray-500 text-xs">
                <div className="flex items-center gap-2 cursor-pointer hover:text-gray-800 transition-colors">
                    <span>Open recordings</span>
                    <ChevronRight size={12} />
                </div>
            </div>
        </div>
    );
};

// Simple Umbrella Icon for placeholder
const Umbrella = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 12a10.06 10.06 10 0 0-20 0Z" />
        <path d="M12 12v8" />
        <path d="M11 20a1 1 0 1 0 2 0" />
    </svg>
);

const ChevronDown = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m6 9 6 6 6-6" />
    </svg>
);
