'use client'

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// export default function HelloPage() {
//   const [message, setMessage] = useState<string>('');
//   const [loading, setLoading] = useState(false);

//   const handleFetchHello = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('/api/hello');
//       const data = await res.json();
//       setMessage(data.message);
//     } catch (error) {
//       console.error('API 호출 실패:', error);
//       setMessage('API 호출 실패');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '100px' }}>
//       <h1>버튼 클릭으로 API 호출</h1>
//       <button 
//         onClick={handleFetchHello}
//         disabled={loading}
//         style={{ padding: '10px 20px', fontSize: '16px', marginBottom: '20px' }}
//       >
//         {loading ? '로딩 중...' : 'Hello API 호출'}
//       </button>

//       <div style={{ marginTop: '20px', fontSize: '18px' }}>
//         {message && <p>결과: {message}</p>}
//       </div>
//     </div>
//   );
// }

export default function UploadAndRecord() {
  const [status, setStatus] = useState('');
  
  
  const handleInsertVideoRecord = async () => {
    setStatus('작업 기록 중...');
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch('/api/user_videos/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ json_filename: null }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '저장 실패');
      }

      setStatus('✅ 영상 기록이 저장되었습니다.');
    } catch (err: any) {
      console.error(err.message);
      setStatus('❌ 저장 실패: ' + err.message);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>🎬 영상 업로드 후 기록하기</h2>
      <button onClick={handleInsertVideoRecord}>
        📥 영상 기록 저장
      </button>
      <p>{status}</p>
    </div>
  );
}
