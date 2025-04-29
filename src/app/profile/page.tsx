'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import VideoLogTable from '@/components/VideoLogTable';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [videos, setVideos] = useState<any[]>([]); // ✅ 영상 기록 상태 추가

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
      setLoading(false);

      // ✅ 영상 기록 가져오기
      const { data: videoData, error: videoError } = await supabase
        .from('user_videos')
        .select('*')
        .eq('user_id', user?.id)
        .order('uploaded_at', { ascending: false });

      if (videoError) {
        console.error('영상 기록 조회 실패:', videoError.message);
      } else {
        setVideos(videoData || []);
      }
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
      <input value={nickname} placeholder='nick name' onChange={(e) => setNickname(e.target.value)} />
      <button onClick={handleSave}>저장</button>
      <p>{message}</p>

      <button onClick={handleLogout} style={{ marginTop: 16 }}>
        로그아웃
      </button>

      {/* ✅ 영상 기록 테이블 표시 */}
      <h2 style={{ marginTop: 32 }}>🎬 영상 작업 기록</h2>
      <VideoLogTable videos={videos} />
    </div>
  );
}
