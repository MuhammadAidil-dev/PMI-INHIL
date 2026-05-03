'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewsCategory } from '../../types/admin-berita-broadcast.type';
import Breadcrumb from '../ui/BreadCrumb';
import RichTextEditor from '../ui/RichTextEditor';
import ImageUpload from '../ui/ImaegUpload';
import PublishSettings from '../ui/PublishSetting';

type PublishType = 'now' | 'draft';

interface CreateNewsFormData {
  title: string;
  content: string;
  category: NewsCategory | '';
  publishType: PublishType;
  image: File | null;
}

const BREADCRUMB_ITEMS = [
  { label: 'Broadcast CMS', href: '/broadcast' },
  { label: 'Buat Berita Baru' },
];

export default function CreateNewsView() {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateNewsFormData>({
    title: '',
    content: '',
    category: '',
    publishType: 'now',
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = <K extends keyof CreateNewsFormData>(
    key: K,
    value: CreateNewsFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Judul dan isi berita wajib diisi.');
      return;
    }
    if (!formData.category) {
      alert('Pilih kategori berita.');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: kirim ke API menggunakan apiClient
      // const fd = new FormData();
      // fd.append('title', formData.title);
      // fd.append('content', formData.content);
      // fd.append('category', formData.category);
      // fd.append('status', formData.publishType === 'now' ? 'published' : 'draft');
      // if (formData.image) fd.append('image', formData.image);
      // const { data, error } = await apiClient.upload('/news', fd);
      // if (error) { handleError(error); return; }

      console.log('Submit payload:', formData);
      router.push('/berita');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="lg:ml-64 w-full p-6 bg-gray-50 min-h-[calc(100vh-60px)]">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Breadcrumb items={BREADCRUMB_ITEMS} />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Buat Berita Baru
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Publikasikan informasi terbaru untuk relawan dan masyarakat.
          </p>
        </div>

        <div className="flex gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              setField('publishType', 'draft');
              handleSubmit();
            }}
            disabled={isSubmitting}
            className="px-5 py-2 border border-rose-200 bg-rose-50 text-rose-700 rounded-lg text-sm font-semibold hover:bg-rose-100 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            Simpan sebagai Draft
          </button>
        </div>
      </div>

      {/* ─── Form Grid ─── */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Konten Utama — 8/12 */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Card Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Konten Utama
              </h3>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-6">
              {/* Judul */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="title"
                  className="text-[11px] font-bold text-gray-700 uppercase tracking-wider"
                >
                  Judul Berita
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setField('title', e.target.value)}
                  placeholder="Masukkan judul berita yang menarik..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder:text-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                />
              </div>

              {/* Isi Berita */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Isi Berita
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(val) => setField('content', val)}
                  minHeight={400}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Settings + Upload — 4/12 */}
        <div className="lg:col-span-4 space-y-6">
          <PublishSettings
            category={formData.category}
            onCategoryChange={(val) => setField('category', val)}
            publishType={formData.publishType}
            onPublishTypeChange={(val) => setField('publishType', val)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />

          <ImageUpload
            value={formData.image}
            onChange={(file) => setField('image', file)}
          />
        </div>
      </div>
    </main>
  );
}
