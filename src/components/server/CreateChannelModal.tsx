import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Hash, Volume2, Video as VideoIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ChannelType } from '../../types';

interface CreateChannelModalProps {
    isOpen: boolean;
    onClose: () => void;
    serverId: string;
    defaultType?: ChannelType;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
    isOpen,
    onClose,
    serverId,
    defaultType = 'text'
}) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<ChannelType>(defaultType);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || isLoading) return;

        try {
            setIsLoading(true);

            // Get current max position
            const { data: existingChannels } = await supabase
                .from('channels')
                .select('position')
                .eq('server_id', serverId)
                .order('position', { ascending: false })
                .limit(1);

            const nextPosition = existingChannels && existingChannels.length > 0
                ? existingChannels[0].position + 1
                : 0;

            const { error } = await supabase
                .from('channels')
                .insert([{
                    name: name.toLowerCase().replace(/\s+/g, '-'),
                    type,
                    server_id: serverId,
                    position: nextPosition
                }]);

            if (error) throw error;

            setName('');
            setType('text');
            onClose();
        } catch (error: any) {
            console.error('Error creating channel:', error);
            alert(`Failed to create channel: ${error.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Channel">
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-4">
                    <p className="text-[#4e5058] text-[10px] font-black uppercase tracking-[0.2em] px-1">Channel Type</p>
                    <div className="grid gap-2">
                        {[
                            { id: 'text', label: 'Text', icon: Hash, desc: 'Send messages, images, and GIFs' },
                            { id: 'voice', label: 'Voice', icon: Volume2, desc: 'Hang out with voice and audio only' },
                            { id: 'video', label: 'Video', icon: VideoIcon, desc: 'Full video and screenshare experience' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setType(item.id as ChannelType)}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${type === item.id
                                    ? 'bg-[#00f0ff]/10 border-[#00f0ff]/40 text-white shadow-[0_0_20px_rgba(0,240,255,0.05)]'
                                    : 'bg-[#0b0c10] border-white/5 text-[#949ba4] hover:bg-[#1a1b1e] hover:border-white/10'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${type === item.id ? 'bg-[#00f0ff] text-[#040506]' : 'bg-[#1e1f22] text-[#4e5058] group-hover:text-[#949ba4]'}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className={`text-sm font-bold uppercase tracking-tight ${type === item.id ? 'text-[#00f0ff]' : ''}`}>
                                        {item.label}
                                    </div>
                                    <p className="text-[10px] font-medium opacity-60 leading-tight mt-0.5">{item.desc}</p>
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${type === item.id ? 'border-[#00f0ff]' : 'border-[#4e5058]'}`}>
                                    {type === item.id && <div className="w-2 h-2 rounded-full bg-[#00f0ff]" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[#4e5058] text-[10px] font-black uppercase tracking-[0.2em] px-1">Channel Name</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4e5058]">
                            {type === 'text' ? <Hash className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </div>
                        <input
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="new-channel"
                            className="w-full bg-[#040506] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-[#4e5058] focus:border-[#00f0ff]/40 focus:outline-none transition-all font-bold tracking-tight"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3.5 rounded-xl bg-[#1e1f22] text-[#949ba4] font-bold hover:bg-[#2b2d31] hover:text-white transition-all border border-white/5"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isLoading || !name.trim()}
                        type="submit"
                        className="flex-1 px-4 py-3.5 rounded-xl bg-[#00f0ff] text-[#040506] font-black uppercase tracking-widest hover:bg-[#00d0e0] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(0,240,255,0.3)] active:scale-95"
                    >
                        {isLoading ? 'Decrypting...' : 'Establish Link'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
