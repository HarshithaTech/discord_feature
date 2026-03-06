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
import { ServerSettingsModal } from '../ui/ServerSettingsModal';
import { UserProfileModal } from '../ui/UserProfileModal';
import { ZoomWorkspace } from './ZoomWorkspace';
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
                        <ZoomWorkspace />
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
