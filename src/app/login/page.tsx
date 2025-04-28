'use client';

import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setToken(error.message);
    else setToken(data.session?.access_token ?? '로그인 성공 but no token!');
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>로그인</h1>
      <input
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
      <pre>{token}</pre>
    </div>
  );
}  

