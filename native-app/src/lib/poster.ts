import { requireOptionalNativeModule } from 'expo';
import { File, Paths } from 'expo-file-system';

export type SaveResult = 'saved' | 'opened' | 'denied';

// Downloads the poster and saves it to the phone's gallery (web: poster.web.ts).
//
// expo-media-library is loaded only when saving, and its new API is used only
// when the native module exists: Expo Go ships just the legacy module, and
// importing the new API at startup crashes the whole app there.
export async function savePosterToGallery(url: string, eventId: string): Promise<SaveResult> {
  const extension = url.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
  const target = new File(Paths.cache, `cubuddy-poster-${eventId}.${extension}`);

  if (requireOptionalNativeModule('ExpoMediaLibraryNext')) {
    const { Asset, requestPermissionsAsync } = await import('expo-media-library');
    const permission = await requestPermissionsAsync(true, ['photo']);
    if (!permission.granted) return 'denied';
    const file = await File.downloadFileAsync(url, target, { idempotent: true });
    await Asset.create(file.uri);
    return 'saved';
  }

  const legacy = await import('expo-media-library/legacy');
  const permission = await legacy.requestPermissionsAsync(true, ['photo']);
  if (!permission.granted) return 'denied';
  const file = await File.downloadFileAsync(url, target, { idempotent: true });
  await legacy.saveToLibraryAsync(file.uri);
  return 'saved';
}
