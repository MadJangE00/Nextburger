// app/test/page.tsx
'use client';

import UploadVideoClient from '@/components/UploadVideoClient';

export default function TestPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold mb-6">📤 영상 업로드 테스트</h1>
      <UploadVideoClient />
    </main>
  );
}
