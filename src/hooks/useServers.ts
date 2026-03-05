import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Server } from '../types';

export const useServers = (userId: string | undefined) => {
    const [servers, setServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchServers = async () => {
            setLoading(true);
            // Get servers where user is a member
            const { data, error } = await supabase
                .from('members')
                .select(`
          servers (
            id,
            name,
            imageUrl: image_url,
            inviteCode: invite_code,
            ownerId: owner_id,
            createdAt: created_at
          )
        `)
                .eq('profile_id', userId);

            if (error) {
                console.error('Error fetching servers:', error);
            } else {
                // Filter out any null servers and map to the Server type
                const flattenedServers = (data?.map((item: any) => item.servers).filter(Boolean) || []) as Server[];
                setServers(flattenedServers);
            }
            setLoading(false);
        };

        fetchServers();

        // Subscribe to changes in members or servers
        const subscription = supabase
            .channel('server_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'members',
                filter: `profile_id=eq.${userId}`
            }, () => {
                fetchServers();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [userId]);

    return { servers, loading };
};
