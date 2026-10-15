import imageCompression from 'browser-image-compression';
import { MEDIA_BUCKET, supabase } from './supabase';

export interface UploadedImage {
  url: string;
  path: string;
}

// Posters are the biggest bandwidth cost, so shrink them before upload:
// max 1080px on the long side, WebP, ~300 KB.
export async function uploadImage(file: File, folder: 'posters' | 'logos' | 'banners'): Promise<UploadedImage> {
  const compressed = await imageCompression(file, {
    maxWidthOrHeight: folder === 'logos' ? 400 : 1080,
    maxSizeMB: 0.3,
    fileType: 'image/webp',
    initialQuality: 0.82,
    useWebWorker: true,
  });

  const path = `${folder}/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, compressed, {
    contentType: 'image/webp',
    cacheControl: '31536000',
  });
  if (error) throw error;

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

// Best effort: a leftover file is harmless, so never block a save on this.
export async function removeImage(path: string | null | undefined) {
  if (!path) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) console.warn('Could not remove old image', path, error.message);
}
