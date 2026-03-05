import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface JoinServerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (serverId: string) => void;
}

export const JoinServerModal: React.FC<JoinServerModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!inviteCode.trim() || !user) return;

        setLoading(true);
        setError('');
        try {
            const { data: server, error: fetchError } = await supabase
                .from('servers')
                .select('id')
                .eq('invite_code', inviteCode.trim().toUpperCase())
                .single();

            if (fetchError || !server) {
                setError('Invalid invite code');
                return;
            }

            // 1. Create Member record
            const { error: memberError } = await supabase
                .from('members')
                .insert({
                    server_id: server.id,
                    profile_id: user.id,
                    role: 'member',
                });

            if (memberError) {
                if (memberError.code === '23505') { // Unique constraint violation
                    setError('You are already a member of this server');
                } else {
                    throw memberError;
                }
                return;
            }

            onSuccess(server.id);
            onClose();
            setInviteCode('');
        } catch (err) {
            console.error('Error joining server:', err);
            setError('Failed to join server');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-[#313338] w-full max-w-md rounded-lg shadow-xl p-8" onClick={(e) => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <h2 className="text-white text-2xl font-bold mb-2">Join a Server</h2>
                    <p className="text-[#b5bac1]">Enter an invite to join an existing server.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[#b5bac1] text-xs font-bold uppercase mb-2">Invite Link</label>
                        <input
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            placeholder="h7G2Iwv"
                            className="w-full bg-[#1e1f22] text-white p-2 rounded outline-none border border-[#1e1f22] focus:border-[#5865f2] transition"
                            required
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white py-2 rounded font-medium transition disabled:opacity-50"
                        >
                            {loading ? 'Joining...' : 'Join Server'}
                        </button>
                        <button type="button" onClick={onClose} className="text-[#dbdee1] hover:underline text-sm py-2">Back</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
