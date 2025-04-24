'use client'

// ********cors 관리 필요************


import { useState } from 'react'

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState('')
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8000/generate-image/')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('프롬프트를 입력하세요')
      return
    }

    setError(null)
    setLoading(true)
    setImageUrl(null)

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('서버 응답 실패')
      }

      const blob = await response.blob()
      const imageObjectURL = URL.createObjectURL(blob)
      setImageUrl(imageObjectURL)
    } catch (err: any) {
      setError(err.message || '이미지 처리 중 오류 발생')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-4 p-4">
      <h1 className="text-2xl font-bold">🖼️ 이미지 생성기</h1>
      <input
        className="w-full border p-2 rounded"
        placeholder="Prompt 입력해주세요"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="FastAPI 서버 주소"
        value={apiUrl}
        onChange={(e) => setApiUrl(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '이미지 생성 중...' : 'Generate'}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {imageUrl && (
        <img
          src={imageUrl}
          alt="생성된 이미지"
          className="w-full mt-4 rounded shadow"
        />
      )}
    </div>
  )
}
