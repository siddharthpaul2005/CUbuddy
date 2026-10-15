import { useState } from 'react';
import { uploadImage, type UploadedImage } from '../lib/media';
import { errorMessage } from '../lib/errors';

interface Props {
  label: string;
  folder: 'posters' | 'logos' | 'banners';
  url: string | null;
  onUploaded: (img: UploadedImage) => void;
  onClear: () => void;
}

// Uploads immediately on pick so the form only has to store url + path.
export function ImageField({ label, folder, url, onUploaded, onClear }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onUploaded(await uploadImage(file, folder));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex items-start gap-4">
        {url ? (
          <img src={url} alt="" className="h-40 w-32 rounded-md border border-slate-200 object-cover" />
        ) : (
          <div className="flex h-40 w-32 items-center justify-center rounded-md border border-dashed border-slate-300 text-xs text-slate-400">
            No image
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="btn-secondary cursor-pointer">
            {busy ? 'Uploading…' : url ? 'Replace' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={busy}
              onChange={(e) => {
                handleFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </label>
          {url && (
            <button type="button" className="btn-danger" onClick={onClear} disabled={busy}>
              Remove
            </button>
          )}
          <p className="max-w-48 text-xs text-slate-500">Compressed to WebP automatically before upload.</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
