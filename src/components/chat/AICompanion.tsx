import React from 'react';
import { Sparkles, Bell, Video, X, ArrowUp } from 'lucide-react';

export const AICompanion: React.FC = () => {
    return (
        <div className="w-[340px] h-full bg-white border-l border-gray-100 flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.02)] animate-in slide-in-from-right duration-500">
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-[15px]">AI Companion</span>
                    <span className="bg-[#8E55EA] text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none">BASIC</span>
                </div>
                <div className="flex items-center gap-3">
                    <Bell size={18} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                    <Video size={18} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                    <X size={18} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                </div>
            </div>

            {/* Notification Banner */}
            <div className="bg-[#F8F9FA] px-4 py-2 border-b border-gray-100 flex items-center justify-between group">
                <span className="text-[#0E71EB] text-xs font-medium cursor-pointer hover:underline">See what's included</span>
                <X size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
                <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-tr from-[#0E71EB] to-[#8E55EA] rounded-3xl rotate-45 flex items-center justify-center shadow-xl animate-pulse-slow">
                        <Sparkles size={32} className="text-white -rotate-45" />
                    </div>
                </div>

                <div className="space-y-3 w-full">
                    {[
                        "What are some tips for running a Zoom meeting",
                        "Coordinate meetings with external contacts",
                        "Schedule a meeting with contact"
                    ].map((text, i) => (
                        <div key={i} className="p-3 bg-white border border-gray-100 rounded-xl text-[13px] text-gray-600 hover:border-[#0E71EB]/30 hover:bg-blue-50/30 cursor-pointer transition-all duration-200">
                            {text}
                        </div>
                    ))}

                    <div className="p-3 bg-white border border-transparent rounded-xl text-[13px] font-medium text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-between border-blue-200/50">
                        <span>Tell me what I can do with AI Companion</span>
                        <div className="w-5 h-5 bg-white rounded flex items-center justify-center text-[#8E55EA] shadow-sm">
                            <ArrowUp size={12} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Input */}
            <div className="p-4 bg-white space-y-4">
                <div className="flex flex-col items-center gap-2">
                    <a href="#" className="text-[#0E71EB] text-xs font-medium hover:underline flex items-center gap-1">
                        Try on the web
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>
                </div>
                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                    </div>
                    <input
                        className="w-full bg-[#f4f5f7] border-none rounded-2xl py-2.5 pl-10 pr-10 text-[13px] focus:ring-2 focus:ring-[#0E71EB]/20 transition-all outline-none"
                        placeholder="Write a message or type / for more"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                        <ArrowUp size={16} />
                    </div>
                </div>
                <p className="text-center text-[10px] text-gray-400">AI can make mistakes. Review for accuracy.</p>
            </div>
        </div>
    );
};
