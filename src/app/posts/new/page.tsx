'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function PostCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    const session = (await supabase.auth.getSession()).data.session;
if (!session) {
  setError('로그인이 필요합니다.');
  return;
}

const user = session.user;

// 사용자 nickname 조회
const { data: userInfo } = await supabase
  .from('users')
  .select('nickname')
  .eq('id', user.id)
  .single();

// 글 작성
const { error: insertError } = await supabase.from('posts').insert({
  user_id: user.id,
  title,
  content,
  nickname: userInfo?.nickname ?? '익명',  // ✅ 함께 저장
});

if (insertError) {
  setError(insertError.message);
} else {
  router.push('/posts');
}
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>✍️ 새 글 작성</h1>
      <input
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', marginBottom: 16 }}
      />
      <textarea
        placeholder="본문 내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: '100%', height: 200 }}
      />
      <button onClick={handleSubmit} style={{ marginTop: 16 }}>등록하기</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
