import { BookOpen } from 'lucide-react';

export const TopNavbar: React.FC = () => {
    return (
        <div className="h-16 bg-[#040506] border-b border-[#1e1f22] flex items-center px-6 justify-between shrink-0 z-50">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00f0ff] rounded-lg flex items-center justify-center cyan-glow">
                    <BookOpen className="text-[#040506] w-6 h-6" />
                </div>
                <h1 className="text-white text-xl font-black tracking-tighter uppercase whitespace-nowrap">
                    EDUSPHERE DISCORD
                </h1>
            </div>

            {/* User Profile Only */}
            <div className="flex items-center">
                <div className="w-9 h-9 rounded-full bg-[#1e1f22] border-2 border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] text-sm font-bold cursor-pointer hover:border-[#00f0ff] transition">
                    H
                </div>
            </div>
        </div>
    );
};
