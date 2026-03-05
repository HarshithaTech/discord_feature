import React from 'react';
import { ShieldCheck, Calendar, Info } from 'lucide-react';

interface ProfileSidebarProps {
    user: any;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user }) => {
    if (!user) return null;

    const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
    const createdAt = new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="w-[340px] bg-[#040506] flex flex-col h-full border-l border-[#1e1f22] overflow-y-auto no-scrollbar shrink-0">
            {/* Header / Banner */}
            <div className="h-[120px] bg-gradient-to-br from-[#00f0ff]/20 to-[#040506] relative shrink-0 border-b border-[#1e1f22]">
                <div className="absolute -bottom-12 left-4 p-1 bg-[#040506] rounded-full border border-[#1e1f22]">
                    <div className="w-20 h-20 rounded-full bg-[#08090b] flex items-center justify-center text-[#00f0ff] text-2xl font-black border-4 border-[#040506] cyan-glow shadow-2xl">
                        {username.substring(0, 1).toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="mt-14 px-4 pb-4 flex flex-col gap-4">
                <div className="bg-[#08090b] border border-[#1e1f22] rounded-xl p-4 cyan-glow/5">
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-white text-xl font-bold tracking-tight">{username}</h2>
                        <div className="bg-[#00f0ff] text-[#040506] text-[10px] font-black px-1.5 rounded flex items-center gap-0.5 uppercase h-4">
                            <ShieldCheck className="w-3 h-3" />
                            OFFICIAL
                        </div>
                    </div>
                    <div className="text-[#949ba4] text-xs font-medium flex items-center gap-1">
                        <span className="text-[#00f0ff]">@</span>{username.toLowerCase()}
                    </div>

                    <div className="h-[1px] bg-[#1e1f22] my-4" />

                    <div className="flex flex-col gap-3">
                        <div>
                            <div className="text-[#f2f3f5] text-[10px] font-black uppercase mb-2 tracking-wider opacity-60">Member Since</div>
                            <div className="flex items-center gap-2 text-[#dbdee1] text-xs font-medium">
                                <Calendar className="w-4 h-4 text-[#00f0ff]" />
                                {createdAt}
                            </div>
                        </div>

                        <div>
                            <div className="text-[#f2f3f5] text-[10px] font-black uppercase mb-2 tracking-wider opacity-60">Learning Path</div>
                            <div className="flex items-center gap-2 text-[#dbdee1] text-xs font-medium">
                                <Info className="w-4 h-4 text-[#00f0ff]" />
                                #AdvancedEngineering
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#08090b] border border-[#1e1f22] rounded-xl p-4">
                    <div className="text-[#f2f3f5] text-[10px] font-black uppercase mb-2 tracking-wider opacity-60">Personal Note</div>
                    <textarea
                        placeholder="Click to add a note"
                        className="w-full bg-transparent text-[#dbdee1] text-xs outline-none resize-none placeholder:text-[#949ba4] min-h-[60px]"
                        rows={2}
                    />
                </div>
            </div>
        </div>
    );
};
