import React, { useState } from 'react';
import { Layout, Calendar as CalendarIcon, MessageSquare, Clock, LayoutGrid, FileText, MoreHorizontal, Settings, Search, History } from 'lucide-react';
import { QuickActions } from '../ui/QuickActions';
import { CalendarWidget } from '../ui/CalendarWidget';
import { AICompanion } from '../chat/AICompanion';

export const ZoomWorkspace: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Home');
    const showAI = true;

    const tabs = [
        { name: 'Home', icon: Layout },
        { name: 'Calendar', icon: CalendarIcon },
        { name: 'Team Chat', icon: MessageSquare },
        { name: 'Scheduler', icon: Clock },
        { name: 'Hub', icon: LayoutGrid },
        { name: 'Docs', icon: FileText },
        { name: 'Whiteboards', icon: WhiteboardIcon },
    ];

    const today = new Date();
    const timeString = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="flex h-full w-full bg-[#F8F9FA] overflow-hidden animate-in fade-in duration-700">
            <div className="flex-1 flex flex-col min-w-0">
                {/* Custom Workspace Header */}
                <div className="h-[60px] bg-white border-b border-gray-100 flex items-center px-4 justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-400">
                            <button className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronLeft size={16} /></button>
                            <button className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronRight size={16} /></button>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors"><History size={16} /></button>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                className="bg-[#f2f3f5] rounded-lg py-1.5 pl-9 pr-3 text-xs w-[240px] focus:ring-2 focus:ring-[#0E71EB]/20 outline-none transition-all"
                                placeholder="Search"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-all flex flex-col items-center relative group ${activeTab === tab.name ? 'text-[#0E71EB]' : 'text-[#4A4E54] hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon size={20} className="mb-0.5" />
                                <span className="text-[10px]">{tab.name}</span>
                                {activeTab === tab.name && (
                                    <div className="absolute -bottom-1 left-2 right-2 h-[3px] bg-[#0E71EB] rounded-t-full" />
                                )}
                            </button>
                        ))}
                        <button className="px-4 py-2 text-[#4A4E54] hover:bg-gray-50 rounded-lg transition-all flex flex-col items-center">
                            <MoreHorizontal size={20} className="mb-0.5" />
                            <span className="text-[10px]">More</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <Settings size={20} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0E71EB] to-blue-300 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            H
                        </div>
                    </div>
                </div>

                {/* Workspace Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-[700px] mx-auto pt-16 pb-20 px-6">
                        {/* Time & Date */}
                        <div className="text-center space-y-1 mb-4">
                            <h1 className="text-5xl font-light text-gray-800 tracking-tight">{timeString}</h1>
                            <p className="text-gray-400 font-medium text-sm">{dateString}</p>
                        </div>

                        {/* Large Quick Actions */}
                        <QuickActions />

                        {/* Calendar Widget */}
                        <div className="flex justify-center">
                            <CalendarWidget />
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Companion Sidebar */}
            {showAI && <AICompanion />}
        </div>
    );
};

// Helper components that aren't in Lucide but in my logic
const ChevronLeft = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
);
const ChevronRight = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);
// Mocking Whiteboard since Lucide might not have it in its standard set for this version
const WhiteboardIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="14" x="3" y="5" rx="2" ry="2" /><path d="M7 21h10" /><path d="M9 21v-2" /><path d="M15 21v-2" /><path d="M3 13h18" />
    </svg>
);
