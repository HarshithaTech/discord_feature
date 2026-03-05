import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const useUpload = () => {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = async (file: File, path: string): Promise<string> => {
        setLoading(true);
        setProgress(0);
        setError(null);

        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${path}/${fileName}`;

        try {
            // Supabase Storage upload
            const { error: uploadError } = await supabase.storage
                .from('attachments')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('attachments')
                .getPublicUrl(filePath);

            setLoading(false);
            setProgress(100);
            return publicUrl;
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    return { uploadFile, progress, loading, error };
};
