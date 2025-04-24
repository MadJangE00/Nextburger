'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

type PostType = {
  id: string
  title: string
  content: string
  nickname: string
  created_at: string
  likes_count?: number
}

export default function PostCard({ post }: { post: PostType }) {
  const [likes, setLikes] = useState(post.likes_count ?? 0)
  const [clicked, setClicked] = useState(false)

  const handleLike = async () => {
    if (clicked) return

    const { error } = await supabase
      .from('posts')
      .update({ likes_count: likes + 1 })
      .eq('id', post.id)

    if (!error) {
      setLikes(likes + 1)
      setClicked(true)
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow space-y-2">
      <h3 className="text-xl font-semibold">
        <Link href={`/posts/${post.id}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="text-gray-700">
        {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
      </p>
      <p className="text-sm text-gray-500">
        작성자: {post.nickname} • {new Date(post.created_at).toLocaleString()}
      </p>
      <button
        onClick={handleLike}
        disabled={clicked}
        className={`text-sm ${clicked ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-500'}`}
      >
        ❤️ 좋아요 {likes}
      </button>
    </div>
  )
}
