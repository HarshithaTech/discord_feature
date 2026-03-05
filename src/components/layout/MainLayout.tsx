import React, { useState } from 'react';
import { useServers } from '../../hooks/useServers';
import { useChannels } from '../../hooks/useChannels';
import { ServerSidebar } from './ServerSidebar';
import { ChannelSidebar } from './ChannelSidebar';
import { CreateServerModal } from '../server/CreateServerModal';
import { JoinServerModal } from '../server/JoinServerModal';
import { CreateChannelModal } from '../server/CreateChannelModal';
import { ChatInterface } from '../chat/ChatInterface';
import { MediaRoom } from '../voice/MediaRoom';
import { ProfileSidebar } from './ProfileSidebar';
import { TopNavbar } from './TopNavbar';
import { Search, UserPlus } from 'lucide-react';
import { ServerSettingsModal } from '../ui/ServerSettingsModal';
import { UserProfileModal } from '../ui/UserProfileModal';
import { supabase } from '../../lib/supabase';
import type { UserStatus, ChannelType } from '../../types';

interface MainLayoutProps {
    user: any;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ user }) => {
    const [activeServerId, setActiveServerId] = useState<string>('home');
    const [activeChannelId, setActiveChannelId] = useState<string>('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [isServerSettingsOpen, setIsServerSettingsOpen] = useState(false);
    const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
    const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
    const [createChannelType, setCreateChannelType] = useState<ChannelType>('text');

    const { servers } = useServers(user?.id);
    const { channels } = useChannels(activeServerId === 'home' ? undefined : activeServerId);

    const activeChannel = channels.find(c => c.id === activeChannelId);

    const handleServerSelect = (serverId: string) => {
        setActiveServerId(serverId);
        setActiveChannelId('');
    };

    const handleAddChannel = (type: ChannelType) => {
        setCreateChannelType(type);
        setIsCreateChannelOpen(true);
    };

    const handleDeleteServer = async () => {
        if (activeServerId === 'home') return;

        try {
            const { error } = await supabase
                .from('servers')
                .delete()
                .eq('id', activeServerId);

            if (error) throw error;

            setActiveServerId('home');
            setActiveChannelId('');
        } catch (error) {
            console.error('Error deleting server:', error);
            alert('Failed to delete server. Make sure you are the owner.');
        }
    };

    const handleUpdateStatus = async (status: UserStatus) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ status })
                .eq('id', user.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#060608] overflow-hidden text-[#dbdee1]">
            <TopNavbar />

            <div className="flex flex-1 overflow-hidden">
                <ServerSidebar
                    servers={servers}
                    activeServerId={activeServerId}
                    onServerSelect={handleServerSelect}
                    onAddServer={() => setIsCreateModalOpen(true)}
                    onJoinServer={() => setIsJoinModalOpen(true)}
                />

                {activeServerId !== 'home' ? (
                    <ChannelSidebar
                        serverId={activeServerId}
                        serverName={servers.find(s => s.id === activeServerId)?.name || 'Server'}
                        channels={channels}
                        activeChannelId={activeChannelId}
                        onChannelSelect={setActiveChannelId}
                        user={user}
                        onServerSettings={() => setIsServerSettingsOpen(true)}
                        onUserSettings={() => setIsUserSettingsOpen(true)}
                        onAddChannel={handleAddChannel}
                    />
                ) : (
                    <ChannelSidebar
                        serverId="home"
                        serverName="Home"
                        channels={[]}
                        activeChannelId=""
                        onChannelSelect={() => { }}
                        user={user}
                        onServerSettings={() => { }}
                        onUserSettings={() => setIsUserSettingsOpen(true)}
                        onAddChannel={() => { }}
                    />
                )}

                <main className="flex-1 flex flex-col min-w-0 bg-[#060608]">
                    {activeChannelId && activeChannel ? (
                        <div className="flex-1 flex overflow-hidden">
                            <div className="flex-1 flex flex-col min-w-0">
                                {activeChannel.type === 'text' ? (
                                    <ChatInterface
                                        serverId={activeServerId}
                                        channelId={activeChannelId}
                                        channelName={activeChannel.name}
                                        userId={user.id}
                                    />
                                ) : (
                                    <MediaRoom
                                        chatId={activeChannelId}
                                        video={activeChannel.type === 'video'}
                                        audio={true}
                                        type={activeChannel.type}
                                        userDisplayName={user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}
                                        serverId={activeServerId}
                                        userId={user.id}
                                        channelName={activeChannel.name}
                                    />
                                )}
                            </div>
                            {activeChannel.type === 'text' && <ProfileSidebar user={user} />}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-[#060608]">
                            {/* Friends Header */}
                            <div className="h-12 w-full border-b border-[#1e1f22] flex items-center px-4 shrink-0 bg-[#060608] justify-between">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-white font-bold text-[15px]">Friends</h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Search className="w-5 h-5 text-[#949ba4] cursor-pointer hover:text-white transition" />
                                    <div className="w-[1px] h-6 bg-[#1e1f22]" />
                                    <button className="bg-[#00f0ff] text-[#040506] text-xs font-black px-4 py-1.5 rounded-lg hover:bg-[#00d0e0] transition cyan-glow uppercase tracking-wider">
                                        Add Friend
                                    </button>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-64 h-64 bg-[#08090b] rounded-full flex items-center justify-center mb-10 border border-[#00f0ff]/10 relative shadow-2xl">
                                    <div className="absolute inset-0 bg-[#00f0ff]/5 rounded-full blur-3xl" />
                                    <div className="w-32 h-32 text-[#00f0ff] opacity-40 relative z-10">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                        </svg>
                                    </div>
                                </div>
                                <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Welcome to EduSphere!</h1>
                                <p className="text-[#949ba4] text-lg mb-8 max-w-sm">
                                    Wumpus is waiting for friends. Select a guild or start a conversation to begin learning.
                                </p>
                                <button className="flex items-center gap-2 bg-[#00f0ff]/10 text-[#00f0ff] px-8 py-3 rounded-full font-bold hover:bg-[#00f0ff]/20 transition border border-[#00f0ff]/30 cyan-glow">
                                    <UserPlus className="w-5 h-5" />
                                    Find Your Peers
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <CreateServerModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={(id) => handleServerSelect(id)}
            />
            <JoinServerModal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                onSuccess={(id) => handleServerSelect(id)}
            />

            <ServerSettingsModal
                isOpen={isServerSettingsOpen}
                onClose={() => setIsServerSettingsOpen(false)}
                serverName={servers.find(s => s.id === activeServerId)?.name || ''}
                onDeleteServer={handleDeleteServer}
            />

            <UserProfileModal
                isOpen={isUserSettingsOpen}
                onClose={() => setIsUserSettingsOpen(false)}
                user={user ? {
                    id: user.id,
                    username: user.user_metadata?.username || user.email?.split('@')[0],
                    email: user.email,
                    status: 'online',
                    createdAt: user.created_at || new Date().toISOString()
                } : null}
                onUpdateStatus={handleUpdateStatus}
            />

            <CreateChannelModal
                isOpen={isCreateChannelOpen}
                onClose={() => setIsCreateChannelOpen(false)}
                serverId={activeServerId}
                defaultType={createChannelType}
            />
        </div>
    );
};
