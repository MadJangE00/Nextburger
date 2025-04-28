'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('구글 로그인 실패:', error.message);
      setLoading(false);
    }
    // 로그인 성공 시 supabase가 알아서 리다이렉트 처리 (따로 리턴 필요 없음)
  };

  // 로그인 상태 확인 → 이미 로그인된 경우 /profile로 보내기
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.replace('/profile'); // 로그인한 경우 바로 /profile로 이동
      }
    };
    checkUser();
  }, [router]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>로그인</h1>
      <button 
        onClick={handleGoogleLogin} 
        disabled={loading}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        {loading ? '로그인 중...' : '구글로 로그인하기'}
      </button>
    </div>
  );
}
