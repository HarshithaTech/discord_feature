import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface CreateServerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (serverId: string) => void;
}

export const CreateServerModal: React.FC<CreateServerModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!name.trim() || !user) return;

        setLoading(true);
        try {
            const inviteCode = Math.random().toString(36).substring(2, 9).toUpperCase();

            // 1. Create Server
            const { data: server, error: serverError } = await supabase
                .from('servers')
                .insert({
                    name,
                    owner_id: user.id,
                    invite_code: inviteCode,
                })
                .select()
                .single();

            if (serverError) throw serverError;

            // 2. Create Default channels (Text & Voice)
            const { error: textChannelError } = await supabase
                .from('channels')
                .insert({
                    server_id: server.id,
                    name: 'general',
                    type: 'text',
                    position: 0,
                });

            if (textChannelError) throw textChannelError;

            const { error: voiceChannelError } = await supabase
                .from('channels')
                .insert({
                    server_id: server.id,
                    name: 'General Voice',
                    type: 'voice',
                    position: 1,
                });

            if (voiceChannelError) throw voiceChannelError;

            // 3. Create Member record (Admin)
            const { error: memberError } = await supabase
                .from('members')
                .insert({
                    server_id: server.id,
                    profile_id: user.id,
                    role: 'admin',
                });

            if (memberError) throw memberError;

            onSuccess(server.id);
            onClose();
            setName('');
        } catch (error) {
            console.error('Error creating server:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-8" onClick={(e) => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <h2 className="text-[#060607] text-2xl font-bold mb-2">Customize your server</h2>
                    <p className="text-[#4e5058]">Give your new server a personality with a name and an icon. You can always change it later.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[#4e5058] text-xs font-bold uppercase mb-2">Server Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My server"
                            className="w-full bg-[#e3e5e8] text-[#060607] p-2 rounded outline-none focus:ring-2 focus:ring-[#5865f2] transition"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <button type="button" onClick={onClose} className="text-[#060607] hover:underline font-medium">Back</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-2 rounded font-medium transition disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
