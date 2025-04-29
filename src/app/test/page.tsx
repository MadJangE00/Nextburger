'use client'

import { useState } from 'react';

export default function HelloPage() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFetchHello = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hello');
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      console.error('API 호출 실패:', error);
      setMessage('API 호출 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>버튼 클릭으로 API 호출</h1>
      <button 
        onClick={handleFetchHello}
        disabled={loading}
        style={{ padding: '10px 20px', fontSize: '16px', marginBottom: '20px' }}
      >
        {loading ? '로딩 중...' : 'Hello API 호출'}
      </button>

      <div style={{ marginTop: '20px', fontSize: '18px' }}>
        {message && <p>결과: {message}</p>}
      </div>
    </div>
  );
}
