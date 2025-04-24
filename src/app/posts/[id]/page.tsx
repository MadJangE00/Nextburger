'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // "new" 경로면 상세 페이지가 아님 → 무시
    if (id === 'new') {
      setLoading(false); // 로딩 상태를 false로 바꿔줘야 화면 멈추지 않음
      return;
    }
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`    
            *,
            users ( nickname )
        `)
        .eq('id', id)
        .single();

      if (error) setError(error.message);
      else setPost(data);

      setLoading(false);
    };

    if (id) fetchPost();
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm('정말 삭제하시겠습니까?');
    if (!confirm) return;

    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (!error) router.push('/posts');
    else setError(error.message);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

  return (
    <div style={{ padding: 32 }}>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <div style={{ fontSize: '0.8em', color: '#666', marginTop: 16 }}>
        작성일: {new Date(post.created_at).toLocaleString()}
      </div>
      <button onClick={handleDelete} style={{ marginTop: 16 }}>🗑 삭제</button>
      <br /><br />
      <Link href="/posts">← 목록으로 돌아가기</Link>
    </div>
  );
}