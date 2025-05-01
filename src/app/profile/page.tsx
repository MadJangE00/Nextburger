// app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (!session || error) {
        router.replace('/login');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setAccessToken(session.access_token);
      setLoading(false);
    };

    getSession();
  }, [router]);

  useEffect(() => {
    (async () => {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) return;
      const { data } = await supabase.from('users').select('nickname').eq('id', session.user.id).single();
      if (data) setNickname(data.nickname);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('user_videos')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });
      if (error) {
        console.error('영상 로딩 실패:', error.message);
      } else {
        setVideos(data || []);
      }
    })();
  }, [user]);

  const handleSave = async () => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    const { error } = await supabase.from('users').upsert({
      id: session.user.id,
      nickname,
    });

    if (error) setMessage(error.message);
    else setMessage('✅ 저장 완료');
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: 32 }}>
      <h1>👤 내 프로필</h1>
      <p><strong>이메일:</strong> {user?.email}</p>
      <p><strong>UID:</strong> {user?.id}</p>
      <p><strong>Access Token:</strong> {accessToken}</p>

      <input value={nickname} placeholder='nick name' onChange={(e) => setNickname(e.target.value)} />
      <button onClick={handleSave}>저장</button>
      <p>{message}</p>
      <button onClick={handleLogout} style={{ marginTop: 16 }}>
        로그아웃
      </button>

      <h2 style={{ marginTop: 40 }}>🎞 영상 기록</h2>
      {videos.length === 0 ? (
        <p>등록된 영상이 없습니다.</p>
      ) : (
        <table style={{ marginTop: 16, width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <th style={{ padding: '8px' }}>파일명</th>
              <th>업로드 시각</th>
              <th>상태</th>
              <th>영상 보기</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{video.json_filename || '(없음)'}</td>
                <td>{new Date(video.uploaded_at).toLocaleString()}</td>
                <td>{video.status}</td>
                <td>
                  <button
                    disabled={!video.video_url}
                    onClick={() => {
                      console.log('🎬 selectedVideo:', video.video_url);
                      setSelectedVideo(video.video_url);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 4,
                      backgroundColor: video.video_url ? '#333' : '#ccc',
                      color: '#fff',
                      cursor: video.video_url ? 'pointer' : 'not-allowed'
                    }}
                  >
                    보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedVideo && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedVideo(null)}
        >
          <video
            src={selectedVideo ?? ''}
            controls
            autoPlay
            playsInline
            muted
            style={{ maxWidth: '80%', maxHeight: '80%', backgroundColor: '#000' }}
          />
        </div>
      )}
    </div>
  );
}
