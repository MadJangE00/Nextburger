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

    </div>

    
  );
}
