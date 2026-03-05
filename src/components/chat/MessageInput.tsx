import React, { useState, useRef } from 'react';
import { PlusCircle, Gift, Sticker, Smile, X, Loader2, Zap } from 'lucide-react';
import { useUpload } from '../../hooks/useUpload';

interface MessageInputProps {
    onSendMessage: (content: string, attachments?: string[]) => void;
    placeholder: string;
    serverId: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, placeholder, serverId }) => {
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadFile, loading: uploading, progress } = useUpload();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && attachments.length === 0) return;
        onSendMessage(content.trim(), attachments);
        setContent('');
        setAttachments([]);
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await uploadFile(file, `servers/${serverId}/uploads`);
            setAttachments(prev => [...prev, url]);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full shrink-0">
            {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 p-2 bg-[#040506]/50 rounded-t-xl border-b border-[#1e1f22]">
                    {attachments.map((url, i) => (
                        <div key={i} className="relative group">
                            <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-[#1e1f22] cyan-glow" />
                            <button
                                onClick={() => removeAttachment(i)}
                                className="absolute -top-1 -right-1 bg-[#f23f42] text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow-lg"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {uploading && (
                        <div className="w-16 h-16 bg-[#040506] rounded-lg flex flex-col items-center justify-center text-[10px] text-[#00f0ff]">
                            <Loader2 className="w-4 h-4 animate-spin mb-1" />
                            <span>{Math.round(progress)}%</span>
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="flex items-center px-4 py-3 gap-4">
                    <label className="cursor-pointer group">
                        <PlusCircle
                            onClick={handleFileClick}
                            className="w-5 h-5 text-[#949ba4] group-hover:text-[#00f0ff] transition"
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </label>

                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                handleSubmit(e);
                            }
                        }}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent text-[#dbdee1] outline-none py-1 text-[15px] placeholder:text-[#4f5660]"
                    />

                    <div className="flex items-center gap-4 text-[#949ba4]">
                        <Zap className="w-5 h-5 cursor-pointer hover:text-[#00f0ff] transition" />
                        <Smile className="w-5 h-5 cursor-pointer hover:text-[#00f0ff] transition" />
                    </div>
                </div>
            </form>
        </div>
    );
};
