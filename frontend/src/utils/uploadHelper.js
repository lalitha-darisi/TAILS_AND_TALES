export default async function uploadHelper(file) {
  // expects VITE_CLOUDINARY_UPLOAD_URL and preset
  const url = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!url || !preset) throw new Error('Cloudinary env not set');

  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', preset);

  const res = await fetch(url, { method: 'POST', body: data });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Upload failed');
  return json.secure_url;
}
