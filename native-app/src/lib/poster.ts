import { File, Paths } from 'expo-file-system';
import { Asset, requestPermissionsAsync } from 'expo-media-library';

export type SaveResult = 'saved' | 'opened' | 'denied';

// Downloads the poster and saves it to the phone's gallery (web: poster.web.ts).
export async function savePosterToGallery(url: string, eventId: string): Promise<SaveResult> {
  const permission = await requestPermissionsAsync(true, ['photo']);
  if (!permission.granted) return 'denied';

  const extension = url.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
  const target = new File(Paths.cache, `cubuddy-poster-${eventId}.${extension}`);
  const file = await File.downloadFileAsync(url, target, { idempotent: true });
  await Asset.create(file.uri);
  return 'saved';
}
