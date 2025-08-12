import { createClient } from '@supabase/supabase-js';

// Create Supabase client only if environment variables are provided
export const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY 
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  : null;

export async function uploadFile(
  bucket: string,
  path: string,
  file: Buffer,
  contentType?: string
): Promise<{ url: string | null; error: any }> {
  if (!supabase) {
    return { url: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: contentType || 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: null, error };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error('Upload exception:', error);
    return { url: null, error };
  }
}

export async function deleteFile(bucket: string, path: string): Promise<{ error: any }> {
  if (!supabase) {
    return { error: new Error('Supabase not configured') };
  }

  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    return { error };
  } catch (error) {
    console.error('Delete exception:', error);
    return { error };
  }
}