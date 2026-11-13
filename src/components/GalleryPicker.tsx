import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, X, Loader2, Check, Trash2 } from 'lucide-react';
import { fetchMedia, uploadMedia, deleteMedia } from '../lib/api';

interface MediaItem {
  name: string;
  url: string;
  size: number;
  date: string;
}

interface GalleryPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function GalleryPicker({ value, onChange, label }: GalleryPickerProps) {
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = async () => {
    setOpen(true);
    setLoading(true);
    try {
      const list = await fetchMedia();
      // Show newest uploads first
      setMedia([...list].reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      setUploading(true);
      try {
        const base64 = (reader.result as string).split(',')[1];
        const res = await uploadMedia(file.name, base64);
        if (res.success) {
          const list = await fetchMedia();
          setMedia([...list].reverse());
          onChange(res.url);
          setOpen(false);
        } else {
          alert('Upload failed. Please try again.');
        }
      } catch (err) {
        console.error(err);
        alert('Upload failed. Please try again.');
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelect = (url: string) => {
    onChange(url);
    setOpen(false);
  };

  const handleDelete = async (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this image from the gallery? This cannot be undone.')) return;
    try {
      await deleteMedia(name);
      setMedia((prev) => prev.filter((m) => m.name !== name));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {value ? (
          <img
            src={value}
            alt="Selected thumbnail"
            className="h-12 w-12 rounded-lg object-cover border border-slate-200 shrink-0"
            onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
          />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
            <ImageIcon className="h-5 w-5 text-slate-300" />
          </div>
        )}
        <button
          type="button"
          onClick={openModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-[11px] uppercase tracking-wider transition cursor-pointer"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          {value ? 'Change Image' : 'Choose from Gallery'}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-black text-[#0B1120]">{label || 'Select Image'}</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-3 border-b border-slate-100">
              <label className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition cursor-pointer py-4 text-xs font-bold text-slate-500">
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Upload New Image from Device
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleUploadFile}
                  disabled={uploading}
                />
              </label>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : media.length === 0 ? (
                <p className="text-center text-xs text-slate-400 font-semibold py-12">No images uploaded yet. Upload your first image above.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {media.map((m) => (
                    <div
                      key={m.name}
                      onClick={() => handleSelect(m.url)}
                      className={`relative group rounded-xl overflow-hidden border-2 cursor-pointer aspect-square bg-slate-50 ${
                        value === m.url ? 'border-blue-500' : 'border-slate-150 hover:border-slate-300'
                      }`}
                    >
                      <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                      {value === m.url && (
                        <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-0.5">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleDelete(m.name, e)}
                        className="absolute bottom-1 right-1 bg-white/90 hover:bg-red-50 rounded-lg p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        title="Delete image"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
