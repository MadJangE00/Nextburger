// components/UploadVideoClient.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function UploadVideoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setMessage('📂 파일을 선택해주세요.');
      return;
    }

    setUploading(true);
    setMessage('⏳ 업로드 중...');

    const session = (await supabase.auth.getSession()).data.session;
    if (!session) {
      setMessage('❌ 로그인 필요');
      return;
    }

    const user = session.user;
    const fileName = `${Date.now()}_${file.name}`;
    const path = `raw/${user.id}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(path, file);

    if (error) {
      setMessage(`❌ 업로드 실패: ${error.message}`);
      setUploading(false);
      return;
    }

    const publicUrl = supabase.storage.from('videos').getPublicUrl(path).data.publicUrl;

    // DB 기록을 위한 API 호출
    const insertRes = await fetch('/api/user_videos/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        video_url: publicUrl,
        json_filename: null,
      })
    });

    if (!insertRes.ok) {
      const { error } = await insertRes.json();
      setMessage(`❌ DB 기록 실패: ${error}`);
    } else {
      setMessage('✅ 업로드 및 기록 완료!');
    }

    setUploading(false);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>📤 영상 업로드</h2>
      <input type="file" accept="video/mp4" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} disabled={uploading} style={{ marginTop: 8 }}>
        {uploading ? '업로드 중...' : '업로드'}
      </button>
      <p>{message}</p>
    </div>
  );
}
