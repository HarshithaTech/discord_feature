import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Message } from '../types';

export const useMessages = (channelId: string | undefined) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!channelId) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select(`
          *,
          profile: profiles (
            username,
            avatar_url
          )
        `)
                .eq('channel_id', channelId)
                .order('created_at', { ascending: true })
                .limit(50);

            if (error) {
                console.error('Error fetching messages:', error);
            } else {
                const mappedMessages = data.map((m: any) => ({
                    id: m.id,
                    channelId: m.channel_id,
                    userId: m.profile_id,
                    content: m.content,
                    attachments: m.attachments,
                    timestamp: m.created_at,
                    edited: m.edited,
                    username: m.profile?.username,
                    avatarUrl: m.profile?.avatar_url
                })) as unknown as Message[];
                setMessages(mappedMessages);
            }
            setLoading(false);
        };

        fetchMessages();

        const subscription = supabase
            .channel(`messages_${channelId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` }, () => {
                fetchMessages();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [channelId]);

    return { messages, loading };
};
