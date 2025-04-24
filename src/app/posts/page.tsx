'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function PostListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false });

console.log('🧾 posts:', data);


      if (data) {
        // 첫 번째 게시글이 있다면 user 정보도 확인
        if (data.length > 0) {
          console.log('👤 첫 번째 글 작성자 ID:', data[0].user_id);
          console.log('🧾 첫 번째 글 닉네임:', data[0].users);
        }
        setPosts(data);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: 32 }}>
      <h1>📋 게시판</h1>
      <Link href="/posts/new">
        <button style={{ marginBottom: 16 }}>➕ 글쓰기</button>
      </Link>
      {posts.length === 0 ? (
        <p>게시글이 없습니다.</p>
      ) : (
        <ul>
          {posts.map((post) => (
  <li key={post.id}>
    <Link href={`/posts/${post.id}`}>
      <strong>{post.title}</strong>
    </Link>
    <div style={{ fontSize: '0.8em', color: '#666' }}>
      작성자: {post.nickname ?? '누규..?'}<br />
      작성일: {new Date(post.created_at).toLocaleString()}
    </div>
  </li>
))}

        </ul>
      )}
    </div>
  );
}
