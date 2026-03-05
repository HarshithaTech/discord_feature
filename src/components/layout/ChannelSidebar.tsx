import { Hash, Volume2, Video, Plus, Settings, Users } from 'lucide-react';
import type { Channel, ChannelType } from '../../types';

interface ChannelSidebarProps {
    serverId: string;
    serverName: string;
    channels: Channel[];
    activeChannelId: string;
    onChannelSelect: (id: string) => void;
    user: any;
    onServerSettings: () => void;
    onUserSettings: () => void;
    onAddChannel: (type: ChannelType) => void;
}

export const ChannelSidebar: React.FC<ChannelSidebarProps> = ({
    serverId,
    serverName,
    channels,
    activeChannelId,
    onChannelSelect,
    user,
    onServerSettings,
    onUserSettings,
    onAddChannel
}) => {
    return (
        <div className="w-60 bg-[#08090b] flex flex-col h-full border-r border-[#1e1f22] select-none">
            {serverId === 'home' ? (
                <>
                    <div className="h-12 border-b border-[#1e1f22] flex items-center px-4 hover:bg-[#1a1b1e] cursor-pointer transition shrink-0">
                        <button className="w-full bg-[#040506] text-[#949ba4] text-[13px] font-medium py-1.5 px-2 rounded-sm text-left flex items-center gap-2 border border-[#1e1f22]">
                            Find or start a conversation
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto pt-4 px-2 flex flex-col gap-0.5 no-scrollbar">
                        <div className="flex items-center px-3 py-2 gap-4 rounded cursor-pointer text-[#00f0ff] bg-[#00f0ff]/10">
                            <Users className="w-6 h-6" />
                            <span className="font-bold text-[15px]">Friends</span>
                        </div>

                        <div className="mt-4 px-2 mb-2 flex items-center justify-between group">
                            <span className="text-[#949ba4] text-[11px] font-bold uppercase tracking-wider">Direct Messages</span>
                            <Plus className="w-4 h-4 text-[#949ba4] cursor-pointer hover:text-white opacity-0 group-hover:opacity-100 transition" />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="h-12 border-b border-[#1e1f22] flex items-center justify-between px-4 hover:bg-[#1a1b1e] cursor-pointer transition shrink-0">
                        <h2 className="text-white font-bold truncate text-[15px]">{serverName} Guild</h2>
                        <Settings
                            onClick={onServerSettings}
                            className="w-4 h-4 text-[#949ba4] hover:text-[#00f0ff] transition cursor-pointer"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pt-4 px-2 no-scrollbar">
                        {/* Text Channels */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between px-2 mb-1 group">
                                <span className="text-[#4e5058] text-[10px] font-black uppercase tracking-[0.2em]">Text Channels</span>
                                <button
                                    onClick={() => onAddChannel('text')}
                                    className="p-1 rounded hover:bg-[#1e1f22] transition-colors group/btn"
                                >
                                    <Plus className="w-3.5 h-3.5 text-[#4e5058] group-hover/btn:text-[#00f0ff] transition-colors" />
                                </button>
                            </div>
                            {channels.filter(c => c.type === 'text').map(channel => (
                                <div
                                    key={channel.id}
                                    onClick={() => onChannelSelect(channel.id)}
                                    className={`flex items-center px-2 py-1.5 rounded cursor-pointer transition-colors mb-0.5 group ${activeChannelId === channel.id
                                        ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                                        : 'text-[#949ba4] hover:bg-[#1a1b1e] hover:text-[#dbdee1]'
                                        }`}
                                >
                                    <Hash className={`w-5 h-5 mr-2 shrink-0 ${activeChannelId === channel.id ? 'text-[#00f0ff]' : 'text-[#80848e]'}`} />
                                    <span className={`font-medium text-[15px] truncate ${activeChannelId === channel.id ? 'font-bold' : ''}`}>
                                        {channel.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Voice Channels */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between px-2 mb-1 group">
                                <span className="text-[#4e5058] text-[10px] font-black uppercase tracking-[0.2em]">Voice Channels</span>
                                <button
                                    onClick={() => onAddChannel('voice')}
                                    className="p-1 rounded hover:bg-[#1e1f22] transition-colors group/btn"
                                >
                                    <Plus className="w-3.5 h-3.5 text-[#4e5058] group-hover/btn:text-[#00f0ff] transition-colors" />
                                </button>
                            </div>
                            {channels.filter(c => c.type === 'voice').map(channel => (
                                <div
                                    key={channel.id}
                                    onClick={() => onChannelSelect(channel.id)}
                                    className={`flex items-center px-2 py-1.5 rounded cursor-pointer transition-colors mb-0.5 group ${activeChannelId === channel.id
                                        ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                                        : 'text-[#949ba4] hover:bg-[#1a1b1e] hover:text-[#dbdee1]'
                                        }`}
                                >
                                    <Volume2 className={`w-5 h-5 mr-2 shrink-0 ${activeChannelId === channel.id ? 'text-[#00f0ff]' : 'text-[#80848e]'}`} />
                                    <span className={`font-medium text-[15px] truncate ${activeChannelId === channel.id ? 'font-bold' : ''}`}>
                                        {channel.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Video Channels */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between px-2 mb-1 group">
                                <span className="text-[#4e5058] text-[10px] font-black uppercase tracking-[0.2em]">Video Channels</span>
                                <button
                                    onClick={() => onAddChannel('video')}
                                    className="p-1 rounded hover:bg-[#1e1f22] transition-colors group/btn"
                                >
                                    <Plus className="w-3.5 h-3.5 text-[#4e5058] group-hover/btn:text-[#00f0ff] transition-colors" />
                                </button>
                            </div>
                            {channels.filter(c => c.type === 'video').map(channel => (
                                <div
                                    key={channel.id}
                                    onClick={() => onChannelSelect(channel.id)}
                                    className={`flex items-center px-2 py-1.5 rounded cursor-pointer transition-colors mb-0.5 group ${activeChannelId === channel.id
                                        ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                                        : 'text-[#949ba4] hover:bg-[#1a1b1e] hover:text-[#dbdee1]'
                                        }`}
                                >
                                    <Video className={`w-5 h-5 mr-2 shrink-0 ${activeChannelId === channel.id ? 'text-[#00f0ff]' : 'text-[#80848e]'}`} />
                                    <span className={`font-medium text-[15px] truncate ${activeChannelId === channel.id ? 'font-bold' : ''}`}>
                                        {channel.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Bottom User Profile Section */}
            <div className="bg-[#040506] border-t border-[#1e1f22] p-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-[#1e1f22] border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] font-bold">
                            {(user?.user_metadata?.username || user?.email)?.substring(0, 1).toUpperCase()}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#23a55a] rounded-full border-2 border-[#040506]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="text-white text-sm font-bold truncate leading-tight">
                            {user?.user_metadata?.username || user?.email?.split('@')[0]}
                        </div>
                        <div className="text-[#949ba4] text-[11px] font-medium flex items-center gap-1">
                            <span className="truncate">#LearningPath</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-[#949ba4]">
                    <Settings
                        onClick={onUserSettings}
                        className="w-5 h-5 p-1 hover:bg-[#1e1f22] hover:text-[#00f0ff] rounded cursor-pointer transition"
                    />
                </div>
            </div>
        </div>
    );
};
