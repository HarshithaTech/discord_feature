import React from 'react';
import { Video, PlusSquare, Calendar, MonitorUp, ChevronDown } from 'lucide-react';

export const QuickActions: React.FC = () => {
    return (
        <div className="flex flex-wrap justify-center gap-8 py-10">
            {/* New Meeting */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-[72px] h-[72px] bg-[#FF742E] rounded-[22px] flex items-center justify-center text-white shadow-lg transition-all duration-200 group-hover:bg-[#E66929] group-active:scale-95 relative group">
                    <Video size={36} strokeWidth={1.5} />
                    <div className="absolute -bottom-1 -right-1 bg-[#FF742E] border-2 border-white rounded-md p-0.5 hidden group-hover:flex">
                        <ChevronDown size={12} strokeWidth={3} />
                    </div>
                </div>
                <span className="text-[#4A4E54] text-xs font-medium">New meeting</span>
            </div>

            {/* Join */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-[72px] h-[72px] bg-[#0E71EB] rounded-[22px] flex items-center justify-center text-white shadow-lg transition-all duration-200 group-hover:bg-[#0C63CE] group-active:scale-95">
                    <PlusSquare size={36} strokeWidth={1.5} />
                </div>
                <span className="text-[#4A4E54] text-xs font-medium">Join</span>
            </div>

            {/* Schedule */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-[72px] h-[72px] bg-[#0E71EB] rounded-[22px] flex items-center justify-center text-white shadow-lg transition-all duration-200 group-hover:bg-[#0C63CE] group-active:scale-95">
                    <Calendar size={36} strokeWidth={1.5} />
                </div>
                <span className="text-[#4A4E54] text-xs font-medium">Schedule</span>
            </div>

            {/* Share Screen */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-[72px] h-[72px] bg-[#0E71EB] rounded-[22px] flex items-center justify-center text-white shadow-lg transition-all duration-200 group-hover:bg-[#0C63CE] group-active:scale-95">
                    <MonitorUp size={36} strokeWidth={1.5} />
                </div>
                <span className="text-[#4A4E54] text-xs font-medium">Share screen</span>
            </div>
        </div>
    );
};
