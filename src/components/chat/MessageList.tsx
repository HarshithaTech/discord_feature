import React, { useRef, useEffect } from 'react';
import { Hash, UserPlus } from 'lucide-react';
import type { Message } from '../../types';

interface MessageListProps {
    messages: Message[];
    loading: boolean;
    channelName: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, loading, channelName }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-[#949ba4] gap-2">
                <div className="w-10 h-10 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin cyan-glow" />
                <p className="font-medium text-sm">Synchronizing data...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar bg-[#060608]">
            {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-[#08090b] border border-[#00f0ff]/20 rounded-full flex items-center justify-center mb-6 cyan-glow">
                        <Hash className="w-10 h-10 text-[#00f0ff]" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2">Welcome to #{channelName}!</h1>
                    <p className="text-[#949ba4] text-lg mb-8 max-w-md">
                        This is the start of the #{channelName} channel in this guild.
                    </p>
                    <button className="flex items-center gap-2 bg-[#00f0ff]/10 text-[#00f0ff] px-6 py-2.5 rounded-full font-bold hover:bg-[#00f0ff]/20 transition border border-[#00f0ff]/30 cyan-glow">
                        <UserPlus className="w-5 h-5" />
                        Invite Your Peers
                    </button>
                    <div className="mt-20 w-full h-[1px] bg-gradient-to-r from-transparent via-[#1e1f22] to-transparent" />
                </div>
            ) : (
                messages.map((message, index) => {
                    const isSameUser = index > 0 && messages[index - 1].userId === message.userId;
                    const isBot = message.username?.toLowerCase().includes('bot');

                    return (
                        <div
                            key={message.id}
                            className={`flex group px-4 -mx-4 py-0.5 hover:bg-[#08090b] transition-colors relative ${!isSameUser ? 'mt-6' : 'mt-0.5'}`}
                        >
                            {!isSameUser ? (
                                <div className="flex gap-4 w-full">
                                    <div className="w-10 h-10 rounded-full bg-[#1e1f22] border border-[#00f0ff]/10 shrink-0 mt-1 flex items-center justify-center text-[#00f0ff] font-bold select-none cursor-pointer hover:border-[#00f0ff]/50 transition">
                                        {message.avatarUrl ? <img src={message.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" /> : (message.username?.substring(0, 1).toUpperCase() || 'U')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold hover:underline cursor-pointer text-[15.5px] ${isBot ? 'text-[#00f0ff]' : 'text-[#f2f3f5]'}`}>
                                                {message.username || `User_${message.userId.substring(0, 4)}`}
                                            </span>
                                            {isBot && (
                                                <div className="bg-[#00f0ff] text-[#040506] text-[10px] font-black px-1.5 rounded flex items-center gap-0.5 select-none h-4 uppercase">
                                                    BOT
                                                </div>
                                            )}
                                            <span className="text-[#949ba4] text-[11px] font-medium mt-0.5">
                                                Today at {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) : ''}
                                            </span>
                                        </div>
                                        <div className="text-[#dbdee1] text-[15px] leading-[1.375rem] whitespace-pre-wrap break-words mt-0.5">
                                            {message.content}
                                            {message.attachments && message.attachments.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {message.attachments.map((url, i) => (
                                                        <img key={i} src={url} alt="attachment" className="max-w-[400px] max-h-[300px] rounded-lg border border-[#1e1f22] cyan-glow" />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-4 w-full pl-14">
                                    <div className="absolute left-0 w-14 flex justify-center opacity-0 group-hover:opacity-100 select-none">
                                        <span className="text-[#949ba4] text-[10px] mt-1.5">
                                            {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false }) : ''}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[#dbdee1] text-[15px] leading-[1.375rem] whitespace-pre-wrap break-words">
                                            {message.content}
                                            {message.attachments && message.attachments.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {message.attachments.map((url, i) => (
                                                        <img key={i} src={url} alt="attachment" className="max-w-[400px] max-h-[300px] rounded-lg border border-[#1e1f22]" />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Message actions on hover */}
                            <div className="absolute top-0 right-4 -mt-4 hidden group-hover:flex bg-[#040506] border border-[#1e1f22] rounded-lg shadow-xl z-10 px-1 py-0.5 gap-1 items-center cyan-glow">
                                <div className="p-1 hover:bg-[#1a1b1e] rounded cursor-pointer text-[#949ba4] hover:text-[#00f0ff] text-xs transition">Edit</div>
                                <div className="p-1 hover:bg-[#f23f42]/20 hover:text-[#f23f42] rounded cursor-pointer text-[#949ba4] text-xs transition">Delete</div>
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={bottomRef} />
        </div>
    );
};
