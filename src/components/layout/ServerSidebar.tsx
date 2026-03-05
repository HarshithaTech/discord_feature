import React from 'react';
import { Home, Plus, Compass } from 'lucide-react';

interface ServerSidebarProps {
    servers: any[];
    activeServerId?: string;
    onServerSelect: (id: string) => void;
    onAddServer: () => void;
    onJoinServer: () => void;
}

export const ServerSidebar: React.FC<ServerSidebarProps> = ({
    servers,
    activeServerId,
    onServerSelect,
    onAddServer,
    onJoinServer
}) => {
    return (
        <div className="w-[72px] bg-[#040506] flex flex-col items-center py-4 gap-3 h-full overflow-y-auto no-scrollbar border-r border-[#1e1f22]">
            {/* Home/Ecosystem Button */}
            <div className="relative group flex flex-col items-center">
                <div
                    onClick={() => onServerSelect('home')}
                    className={`w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 ${activeServerId === 'home'
                            ? 'rounded-xl bg-[#00f0ff] text-[#040506] cyan-glow'
                            : 'rounded-[20px] bg-[#08090b] text-[#949ba4] hover:rounded-xl hover:bg-[#00f0ff] hover:text-[#040506] border border-[#1e1f22]'
                        }`}
                >
                    <Home className="w-6 h-6" />
                </div>
                {activeServerId === 'home' && (
                    <div className="absolute -left-3 top-3 w-2 h-6 bg-[#00f0ff] rounded-r-full" />
                )}
            </div>

            <div className="w-8 h-[1px] bg-[#1e1f22] rounded-full mx-auto" />

            {/* Server List */}
            {servers.map((server) => (
                <div key={server.id} className="relative group flex flex-col items-center">
                    <div
                        onClick={() => onServerSelect(server.id)}
                        className={`relative flex items-center justify-center w-12 h-12 cursor-pointer transition-all duration-300 overflow-hidden border ${activeServerId === server.id
                                ? 'rounded-xl bg-[#08090b] border-[#00f0ff] cyan-glow'
                                : 'rounded-[20px] bg-[#08090b] border-[#1e1f22] hover:rounded-xl hover:border-[#00f0ff]/50'
                            }`}
                    >
                        {server.imageUrl ? (
                            <img src={server.imageUrl} alt={server.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className={`font-black text-lg ${activeServerId === server.id ? 'text-[#00f0ff]' : 'text-white'}`}>
                                {server.name.substring(0, 1).toUpperCase()}
                            </span>
                        )}
                    </div>
                    {activeServerId === server.id && (
                        <div className="absolute -left-3 top-3 w-2 h-6 bg-[#00f0ff] rounded-r-full" />
                    )}

                    {/* Tooltip placeholder */}
                    <div className="absolute left-[70px] bg-[#040506] text-white text-xs font-bold px-3 py-1.5 rounded border border-[#1e1f22] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {server.name}
                    </div>
                </div>
            ))}

            <div className="w-8 h-[1px] bg-[#1e1f22] rounded-full mx-auto" />

            {/* Action Buttons */}
            <div
                onClick={onAddServer}
                className="w-12 h-12 rounded-[20px] bg-[#08090b] border border-[#1e1f22] flex items-center justify-center cursor-pointer transition-all duration-300 hover:rounded-xl hover:border-[#00f0ff]/50 hover:text-[#00f0ff] text-[#949ba4]"
            >
                <Plus className="w-6 h-6" />
            </div>

            <div
                onClick={onJoinServer}
                className="w-12 h-12 rounded-[20px] bg-[#08090b] border border-[#1e1f22] flex items-center justify-center cursor-pointer transition-all duration-300 hover:rounded-xl hover:border-[#00f0ff]/50 hover:text-[#00f0ff] text-[#949ba4]"
            >
                <Compass className="w-6 h-6" />
            </div>
        </div>
    );
};
