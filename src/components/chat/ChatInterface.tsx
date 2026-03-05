import { Hash, Bell, Users, Search, Phone, Video } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useMessages } from '../../hooks/useMessages';
import { supabase } from '../../lib/supabase';

interface ChatInterfaceProps {
    serverId: string;
    channelId: string;
    channelName: string;
    userId: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ serverId, channelId, channelName, userId }) => {
    const { messages, loading } = useMessages(channelId);

    const handleSendMessage = async (content: string, attachments?: string[]) => {
        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    channel_id: channelId,
                    profile_id: userId,
                    content,
                    attachments: attachments || [],
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-[#060608] min-w-0 h-full overflow-hidden">
            {/* Header */}
            <header className="h-12 flex items-center px-4 border-b border-[#1e1f22] shrink-0 justify-between bg-[#060608]">
                <div className="flex items-center gap-2 overflow-hidden mr-4">
                    <Hash className="w-5 h-5 text-[#00f0ff] shrink-0" />
                    <h3 className="text-white font-bold truncate text-[16px]">{channelName}</h3>
                    <div className="w-[1px] h-4 bg-[#1e1f22] mx-2" />
                    <p className="text-[#949ba4] text-xs truncate">Welcome to the {channelName} channel of the academy!</p>
                </div>

                <div className="flex items-center gap-4 text-[#949ba4]">
                    <Phone className="w-5 h-5 cursor-pointer hover:text-white transition shrink-0" />
                    <Video className="w-5 h-5 cursor-pointer hover:text-white transition shrink-0" />
                    <Bell className="w-5 h-5 cursor-pointer hover:text-white transition shrink-0" />
                    <Users className="w-5 h-5 cursor-pointer hover:text-white transition shrink-0" />

                    <div className="bg-[#040506] border border-[#1e1f22] rounded flex items-center px-2 py-1 gap-2 group focus-within:border-[#00f0ff]/50 transition-all">
                        <Search className="w-4 h-4 text-[#949ba4]" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent text-xs text-[#dbdee1] outline-none w-24 focus:w-40 transition-all font-medium"
                        />
                    </div>
                </div>
            </header>

            <MessageList
                messages={messages}
                loading={loading}
                channelName={channelName}
            />

            <div className="px-4 pb-6">
                <div className="bg-[#08090b] border border-[#1e1f22] rounded-xl focus-within:border-[#00f0ff]/30 transition-all">
                    <MessageInput
                        serverId={serverId}
                        onSendMessage={handleSendMessage}
                        placeholder={`Message #${channelName}`}
                    />
                </div>
            </div>
        </div>
    );
};
