'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email ?? null);
      
    };

    fetchUser();

    // 로그인/로그아웃 시 자동 갱신
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav style={{
      padding: '16px 32px',
      borderBottom: '1px solid #ccc',
      display: 'flex',
      gap: '24px',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Link href="/">Home</Link>
        <Link href="/signup">회원가입</Link>
        <Link href="/login">로그인</Link>
        <Link href="/socialLogin">소셜로그인</Link>
        <Link href="/posts">게시판</Link>
        <Link href="/profile">프로필</Link>
        <Link href="/test">테스트</Link>
        <Link href="/generate-image">이미지 생성기</Link>
        <Link href="/userlist">회원들</Link>

      </div>
      {userEmail && (
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          👤 {userEmail}
        </div>
      )}
    </nav>
  );
}
