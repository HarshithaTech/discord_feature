import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useLiveKitToken = (roomName: string, userName: string) => {
    const [token, setToken] = useState('');

    useEffect(() => {
        if (!roomName || !userName) return;

        (async () => {
            try {
                const { data, error } = await supabase.functions.invoke('livekit-token', {
                    body: { room: roomName, username: userName }
                });

                if (error) throw error;
                if (data?.token) {
                    setToken(data.token);
                }
            } catch (e) {
                console.error('Error fetching LiveKit token from Edge Function:', e);
            }
        })();
    }, [roomName, userName]);

    return token;
};
