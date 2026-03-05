import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User, UserStatus } from '../types';

export const useUser = (userId: string | undefined) => {
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user:', error);
            } else {
                setUserData({
                    id: data.id,
                    username: data.username,
                    email: data.email || '',
                    status: data.status,
                    createdAt: data.created_at,
                    avatarURL: data.avatar_url
                });
            }
        };

        fetchUser();

        const subscription = supabase
            .channel(`profile_${userId}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` }, (payload) => {
                const data = payload.new as any;
                setUserData({
                    id: data.id,
                    username: data.username,
                    email: data.email || '',
                    status: data.status,
                    createdAt: data.created_at,
                    avatarURL: data.avatar_url
                });
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [userId]);

    const updateStatus = async (status: UserStatus) => {
        if (!userId) return;
        const { error } = await supabase
            .from('profiles')
            .update({ status })
            .eq('id', userId);

        if (error) console.error('Error updating status:', error);
    };

    return { userData, updateStatus };
};
