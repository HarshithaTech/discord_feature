import React, { useState } from 'react';
import {
    LiveKitRoom,
    GridLayout,
    ParticipantTile,
    ControlBar,
    RoomAudioRenderer,
    useTracks,
    LayoutContextProvider,
    FocusLayout,
    CarouselLayout
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import { useLiveKitToken } from '../../hooks/useLiveKitToken';
import { Loader2, MessageSquare, X, Presentation } from 'lucide-react';
import { ChatInterface } from '../chat/ChatInterface';
import { Modal } from '../ui/Modal';
import { Whiteboard } from './Whiteboard';
import type { ChannelType } from '../../types';

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
    type?: ChannelType;
    userDisplayName: string;
    serverId: string;
    userId: string;
    channelName: string;
}

const VideoGrid = () => {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );

    const screenShareTrack = tracks.find((tr) => tr.source === Track.Source.ScreenShare);

    if (screenShareTrack) {
        return (
            <div className="flex flex-col h-full w-full bg-black">
                <div className="flex-1 min-h-0 relative">
                    <FocusLayout trackRef={screenShareTrack} className="h-full w-full" />
                </div>
                <div className="h-32 sm:h-40 shrink-0 border-t border-white/10 bg-[#060608] p-2">
                    <CarouselLayout tracks={tracks.filter(t => t !== screenShareTrack)}>
                        <ParticipantTile />
                    </CarouselLayout>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-black overflow-hidden">
            <GridLayout tracks={tracks} style={{ height: '100%', width: '100%' }}>
                <ParticipantTile />
            </GridLayout>
        </div>
    );
};

export const MediaRoom: React.FC<MediaRoomProps> = ({
    chatId,
    video,
    audio,
    type = 'video',
    userDisplayName,
    serverId,
    userId,
    channelName
}) => {
    const token = useLiveKitToken(chatId, userDisplayName);
    const [showChat, setShowChat] = useState(false);
    const [showWhiteboard, setShowWhiteboard] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

    if (token === '') {
        return (
            <div className="flex flex-col flex-1 justify-center items-center h-full bg-[#060608]">
                <Loader2 className="h-7 w-7 text-[#00f0ff] animate-spin my-4" />
                <p className="text-xs text-[#949ba4] uppercase font-bold tracking-widest">Initialising Secure Link...</p>
            </div>
        );
    }

    const isVoiceOnly = type === 'voice';

    return (
        <div className="flex flex-col flex-1 h-full w-full overflow-hidden bg-[#060608] relative">
            <LiveKitRoom
                token={token}
                serverUrl={import.meta.env.VITE_LIVEKIT_URL}
                connect={true}
                video={video}
                audio={audio}
                data-theme="default"
                className="flex flex-col h-full w-full overflow-hidden relative"
            >
                <LayoutContextProvider>
                    <div className="flex flex-1 overflow-hidden relative min-h-0">
                        <div className="flex-1 flex flex-col relative overflow-hidden bg-black">
                            {isVoiceOnly ? (
                                <div className="flex-1 flex flex-col items-center justify-center bg-[#060608] relative overflow-hidden">
                                    {/* Neural Frequency Visualizer */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00f0ff]/10 rounded-full blur-[100px] animate-pulse" />
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center gap-6 p-4 text-center">
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-[#0a0b0f] border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] text-4xl font-black shadow-[inset_0_0_30px_rgba(0,240,255,0.1),0_0_20px_rgba(0,240,255,0.1)] mb-2">
                                            {userDisplayName.substring(0, 1).toUpperCase()}
                                        </div>
                                        <h3 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tight">{userDisplayName}</h3>
                                        <p className="text-[#00f0ff] text-[10px] font-black uppercase tracking-[0.3em] opacity-60 italic">Neural Audio Sync Active</p>

                                        <div className="flex gap-1 h-8 items-center mt-4">
                                            {[...Array(12)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-1 bg-[#00f0ff]/40 rounded-full animate-bounce"
                                                    style={{
                                                        height: `${20 + Math.random() * 80}%`,
                                                        animationDelay: `${i * 0.1}s`,
                                                        animationDuration: '0.6s'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 h-full w-full relative">
                                    <VideoGrid />
                                </div>
                            )}

                            {/* Floating Tools Controls */}
                            {!isVoiceOnly && (
                                <div className="absolute top-4 right-4 flex flex-col gap-2 z-[110]">
                                    <button
                                        onClick={() => setShowWhiteboard(!showWhiteboard)}
                                        className={`p-3 rounded-xl transition-all duration-300 border backdrop-blur-md shadow-xl ${showWhiteboard ? 'bg-[#ffeb3b] text-black border-[#ffeb3b]/50' : 'bg-black/60 text-[#b5bac1] border-white/10 hover:bg-black/80 hover:text-white'}`}
                                        title={showWhiteboard ? "Hide Whiteboard" : "Show Whiteboard"}
                                    >
                                        <Presentation className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setShowChat(!showChat)}
                                        className={`p-3 rounded-xl transition-all duration-300 border backdrop-blur-md shadow-xl ${showChat ? 'bg-[#00f0ff] text-black border-[#00f0ff]/50' : 'bg-black/60 text-[#b5bac1] border-white/10 hover:bg-black/80 hover:text-white'}`}
                                        title={showChat ? "Hide Chat" : "Show Chat"}
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {/* Whiteboard Layer */}
                            {!isVoiceOnly && showWhiteboard && (
                                <div className="absolute inset-0 z-[100] animate-in fade-in duration-300">
                                    <Whiteboard onClose={() => setShowWhiteboard(false)} />
                                </div>
                            )}
                        </div>

                        {/* Chat Sidebar Overlay */}
                        {!isVoiceOnly && showChat && (
                            <div className="w-[340px] border-l border-[#1e1f22] flex flex-col bg-[#060608] animate-in slide-in-from-right duration-300 relative z-[105]">
                                <div className="h-12 border-b border-[#1e1f22] flex items-center justify-between px-4 shrink-0 bg-[#08090b]">
                                    <span className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-[#00f0ff]" />
                                        Live Chat
                                    </span>
                                    <button onClick={() => setShowChat(false)} className="text-[#949ba4] hover:text-white transition">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <ChatInterface
                                        serverId={serverId}
                                        channelId={chatId}
                                        channelName={channelName}
                                        userId={userId}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Secure Sync Bottom Control Bar */}
                    <div className="bg-[#08090b] border-t border-[#1e1f22] px-4 py-3 shrink-0 z-[120]">
                        <div className="flex items-center justify-center relative max-w-4xl mx-auto">
                            <ControlBar
                                controls={{
                                    leave: false,
                                    screenShare: !isVoiceOnly,
                                    camera: !isVoiceOnly,
                                    chat: false,
                                    settings: !isVoiceOnly
                                }}
                            />
                            <button
                                onClick={() => setShowLeaveConfirm(true)}
                                className="bg-[#ff4655] hover:bg-[#ff4655]/80 text-white px-6 py-2 rounded-xl font-black text-[10px] transition-all ml-6 uppercase tracking-[0.2em] shadow-[0_4px_15px_rgba(255,70,85,0.2)] active:scale-95 shrink-0"
                            >
                                Terminate
                            </button>
                        </div>
                    </div>
                </LayoutContextProvider>

                <RoomAudioRenderer />
            </LiveKitRoom>

            <Modal
                isOpen={showLeaveConfirm}
                onClose={() => setShowLeaveConfirm(false)}
                title="End Transmission"
            >
                <div className="flex flex-col gap-4">
                    <p className="text-[#949ba4] text-center py-2 text-sm">
                        Are you sure you want to disconnect from the current frequency?
                    </p>
                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={() => setShowLeaveConfirm(false)}
                            className="flex-1 px-4 py-3 rounded-lg bg-[#1e1f22] text-[#949ba4] font-bold hover:bg-[#313338] hover:text-white transition text-xs uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                setShowLeaveConfirm(false);
                                window.location.reload();
                            }}
                            className="flex-1 px-4 py-3 rounded-lg bg-[#ff4655] text-white font-bold hover:bg-[#ff4655]/80 transition shadow-[0_4px_15px_rgba(255,70,85,0.3)] text-xs uppercase tracking-widest"
                        >
                            Yes, Leave
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
