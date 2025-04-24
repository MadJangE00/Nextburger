'use client'

import PostCard from '@/components/PostCard'

const dummyPost = {
  id: '1',
  title: '테스트용 게시글',
  content: '이건 테스트용 게시글 내용입니다. 길게 적어도 되고, 잘리는지 확인할 수 있어요.',
  nickname: '테스터유저',
  created_at: new Date().toISOString(),
  likes_count: 3,
}

export default function TestPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">🧪 Test Playground</h1>
      <PostCard post={dummyPost} />
    </div>
  )
}
