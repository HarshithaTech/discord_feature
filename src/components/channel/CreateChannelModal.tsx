import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import type { ChannelType } from '../../types';

interface CreateChannelModalProps {
    isOpen: boolean;
    onClose: () => void;
    serverId: string;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ isOpen, onClose, serverId }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<ChannelType>('text');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('channels')
                .insert({
                    server_id: serverId,
                    name: name.toLowerCase().replace(/\s+/g, '-'),
                    type,
                    position: 0 // Simple default
                });

            if (error) throw error;

            setName('');
            onClose();
        } catch (error) {
            console.error('Error creating channel:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Channel">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[#b5bac1] text-xs font-bold uppercase mb-2">Channel Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="new-channel"
                        className="w-full bg-[#1e1f22] text-[#dbdee1] p-2 rounded outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[#b5bac1] text-xs font-bold uppercase mb-2">Channel Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as ChannelType)}
                        className="w-full bg-[#1e1f22] text-[#dbdee1] p-2 rounded outline-none"
                    >
                        <option value="text">Text</option>
                        <option value="voice">Voice</option>
                        <option value="video">Video</option>
                    </select>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={onClose} className="text-white hover:underline px-4 py-2">Cancel</button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-4 py-2 rounded font-medium disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Channel'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
