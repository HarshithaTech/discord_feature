import React, { useState } from 'react';
import { Modal } from './Modal';
import { Trash2, AlertTriangle, Settings2 } from 'lucide-react';

interface ServerSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    serverName: string;
    onDeleteServer: () => void;
}

export const ServerSettingsModal: React.FC<ServerSettingsModalProps> = ({
    isOpen,
    onClose,
    serverName,
    onDeleteServer
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (showDeleteConfirm) {
        return (
            <Modal
                isOpen={isOpen}
                onClose={() => setShowDeleteConfirm(false)}
                title="Security Clearance"
            >
                <div className="flex flex-col gap-6 p-2">
                    <div className="bg-[#ff4655]/5 border border-[#ff4655]/20 p-5 rounded-2xl flex gap-4 shadow-[0_0_20px_rgba(255,70,85,0.05)]">
                        <AlertTriangle className="w-6 h-6 text-[#ff4655] shrink-0" />
                        <div className="space-y-1">
                            <h4 className="text-[#ff4655] font-black uppercase tracking-tighter text-sm">Destructive Action</h4>
                            <p className="text-sm text-[#949ba4] leading-relaxed">
                                Are you absolutely sure? Deleting <span className="font-bold text-white uppercase tracking-widest px-1 bg-white/5 rounded">{serverName}</span> is a permanent wipe of all guild data.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 px-4 py-3.5 rounded-xl bg-[#1e1f22] text-[#949ba4] font-bold hover:bg-[#2b2d31] hover:text-white transition-all border border-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onDeleteServer();
                                onClose();
                            }}
                            className="flex-1 px-4 py-3.5 rounded-xl bg-[#ff4655] text-white font-black uppercase tracking-widest hover:bg-[#ff4655]/80 transition-all shadow-[0_4px_20px_rgba(255,70,85,0.3)] active:scale-95"
                        >
                            Confirm Wipe
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Guild Intelligence">
            <div className="flex flex-col gap-8 p-2">
                <div className="space-y-4">
                    <div className="relative group overflow-hidden p-6 bg-[#0a0b0f] rounded-2xl border border-[#00f0ff]/20 shadow-[0_0_30px_rgba(0,240,255,0.03)] transition-all hover:border-[#00f0ff]/40">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(0,240,255,0.05),transparent_50%)] pointer-events-none" />
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-16 h-16 bg-[#060608] rounded-2xl border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shadow-[inset_0_0_20px_rgba(0,240,255,0.1),0_0_15px_rgba(0,240,255,0.1)] group-hover:scale-105 transition-transform duration-500">
                                <Settings2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-white text-2xl font-black uppercase tracking-tight leading-none mb-2">{serverName}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] opacity-40" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] opacity-20" />
                                    </div>
                                    <p className="text-[#4e5058] text-[9px] uppercase font-black tracking-[0.2em]">Guild Identifier Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-[#4e5058] text-[10px] font-black uppercase tracking-[0.2em] px-2 mb-2">Management Console</p>

                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full flex items-center gap-3 p-4 rounded-xl text-[#4e5058] hover:bg-[#ff4655]/10 hover:text-[#ff4655] transition-all group border border-transparent hover:border-[#ff4655]/20 active:scale-[0.98]"
                    >
                        <Trash2 className="w-5 h-5 transition-transform group-hover:rotate-12" />
                        <span className="font-bold uppercase tracking-widest text-xs">Terminate Guild Instance</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};
