// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white relative">
      <header className="absolute top-4 left-4 text-sm text-gray-500">
        {user ? `환영합니다, ${user.email}` : '로그인이 필요합니다'}
      </header>

      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-900">MTVS AI 3차 프로젝트</h1>
        <p className="text-lg text-gray-600 mb-10">AI 니가 뭘 할 수 있는데?</p>
        <p className="text-lg text-gray-600 mb-10">다되네?</p>

        {user ? (
          <button
            onClick={() => router.push('/test')}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            업로드 시작하기
          </button>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-gray-300 text-black rounded-full hover:bg-gray-400 transition"
          >
            로그인하러 가기
          </button>
        )}
      </div>
    </main>
  );
}
