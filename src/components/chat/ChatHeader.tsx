import React from 'react';
import { Hash, Bell, Pin, Users, Search, HelpCircle } from 'lucide-react';

interface ChatHeaderProps {
    channelName: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ channelName }) => {
    return (
        <div className="h-12 border-b border-[#1e1f22] flex items-center justify-between px-4 bg-[#313338] shrink-0">
            <div className="flex items-center gap-2 overflow-hidden">
                <Hash className="w-6 h-6 text-[#80848e] shrink-0" />
                <h3 className="text-white font-bold truncate">{channelName}</h3>
            </div>

            <div className="flex items-center gap-4 text-[#b5bac1]">
                <Bell className="w-5 h-5 cursor-pointer hover:text-[#dbdee1]" />
                <Pin className="w-5 h-5 cursor-pointer hover:text-[#dbdee1]" />
                <Users className="w-5 h-5 cursor-pointer hover:text-[#dbdee1]" />
                <div className="bg-[#1e1f22] flex items-center px-2 py-0.5 rounded text-sm w-36">
                    <input type="text" placeholder="Search" className="bg-transparent outline-none w-full" />
                    <Search className="w-4 h-4" />
                </div>
                <HelpCircle className="w-6 h-6 cursor-pointer hover:text-[#dbdee1]" />
            </div>
        </div>
    );
};
