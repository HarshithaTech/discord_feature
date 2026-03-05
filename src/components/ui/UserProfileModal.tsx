import React from 'react';
import { Modal } from './Modal';
import type { User, UserStatus } from '../../types';
import { LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onUpdateStatus: (status: UserStatus) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
    isOpen,
    onClose,
    user,
    onUpdateStatus
}) => {
    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            onClose();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Neural Link Profile">
            <div className="flex flex-col gap-8 p-1">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00f0ff]/30 to-transparent rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>
                    <div className="relative bg-[#0a0b0f] p-8 rounded-2xl border border-[#00f0ff]/10 flex items-center gap-8 shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(0,240,255,0.03),transparent_40%)] pointer-events-none" />
                        <div className="relative">
                            <div className="w-24 h-24 rounded-3xl bg-[#060608] border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] text-4xl font-black shadow-[inset_0_0_30px_rgba(0,240,255,0.15),0_0_20px_rgba(0,240,255,0.1)] group-hover:scale-105 transition-transform duration-500">
                                {user.username.substring(0, 1).toUpperCase()}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-7 h-7 border-4 border-[#0a0b0f] rounded-full shadow-lg transition-transform group-hover:scale-110 ${user.status === 'online' ? 'bg-[#23a559]' : user.status === 'idle' ? 'bg-[#f0b232]' : 'bg-[#80848e]'
                                }`} />
                        </div>
                        <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#00f0ff] opacity-50">Authorized User</span>
                                <div className="h-[1px] w-8 bg-[#00f0ff]/20" />
                            </div>
                            <h2 className="text-white text-3xl font-black tracking-tighter uppercase leading-none mb-2">{user.username}</h2>
                            <p className="text-[#4e5058] text-[10px] font-black uppercase tracking-[0.2em]">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[#4e5058] text-[10px] font-black uppercase tracking-[0.2em]">Synchronization Status</h3>
                        <span className="text-[10px] text-[#00f0ff]/40 font-bold uppercase tracking-widest">Active Link</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {(['online', 'idle', 'offline'] as UserStatus[]).map((status) => (
                            <button
                                key={status}
                                onClick={() => onUpdateStatus(status)}
                                className={`py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${user.status === status
                                    ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                                    : 'bg-[#0b0c10] text-[#4e5058] border-white/5 hover:border-white/10 hover:text-[#949ba4]'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="h-px bg-white/5 my-4 mx-4" />

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-4 rounded-xl text-[#4e5058] hover:bg-[#ff4655]/10 hover:text-[#ff4655] transition-all group border border-transparent hover:border-[#ff4655]/20 active:scale-[0.98]"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="font-black uppercase tracking-widest text-xs">Disconnect Session</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};
