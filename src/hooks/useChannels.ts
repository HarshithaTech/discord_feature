import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Channel } from '../types';

export const useChannels = (serverId: string | undefined) => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!serverId) return;

        const fetchChannels = async () => {
            const { data, error } = await supabase
                .from('channels')
                .select('*')
                .eq('server_id', serverId)
                .order('position', { ascending: true });

            if (error) {
                console.error('Error fetching channels:', error);
            } else {
                setChannels(data as Channel[]);
            }
            setLoading(false);
        };

        fetchChannels();

        const subscription = supabase
            .channel(`channels_${serverId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'channels', filter: `server_id=eq.${serverId}` }, () => {
                fetchChannels();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [serverId]);

    return { channels, loading };
};
