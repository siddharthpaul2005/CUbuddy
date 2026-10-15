import { Linking } from 'react-native';
import type { SaveResult } from './poster';

// Web has no photo gallery: open the poster so the browser can save it.
export async function savePosterToGallery(url: string, _eventId: string): Promise<SaveResult> {
  await Linking.openURL(url);
  return 'opened';
}
