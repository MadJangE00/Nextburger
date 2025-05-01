'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VideoPage() {
  const router = useRouter();
  const [cmd, setCmd] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const FASTAPI_URL = 'http://localhost:8000';

  const handleStartRecording = async () => {
    try {
      const res = await fetch(`${FASTAPI_URL}/start?cmd=${cmd}`, {
        method: 'POST'
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage('녹화 시작 실패');
    }
  };

  const handleStopRecording = async () => {
    try {
      const res = await fetch(`${FASTAPI_URL}/stop`, {
        method: 'POST'
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setMessage('녹화 종료 완료');
    } catch (err) {
      setMessage('녹화 종료 실패');
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;
    const formData = new FormData();
    formData.append('file', uploadedFile);
    try {
      const res = await fetch(`${FASTAPI_URL}/upload_video`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage('업로드 실패');
    }
  };

  const handleGenerate3D = async () => {
    try {
      const res = await fetch(`${FASTAPI_URL}/get_latest_json`, {
        method: 'POST'
      });
      const jsonData = await res.json();
      const unityRes = await fetch('http://192.168.1.177:5001/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
      });
      if (unityRes.ok) {
        setMessage('✅ 유니티로 데이터 전송 완료!');
      } else {
        setMessage('⚠️ 유니티 응답 오류');
      }
    } catch (err) {
      setMessage('3D 영상 생성 실패');
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>🎥 3D 영상 제작 플랫폼</h1>
      <p>웹캠 녹화 또는 영상 업로드를 통해 3D 콘텐츠를 생성하고 유니티로 전송하세요.</p>

      <section style={{ marginTop: 24 }}>
        <h2>📷 웹캠 촬영</h2>
        <input
          type="text"
          placeholder="파일명을 입력하세요"
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
        />
        <div style={{ marginTop: 8 }}>
          <button onClick={handleStartRecording}>▶️ 녹화 시작</button>
          <button onClick={handleStopRecording} style={{ marginLeft: 12 }}>⏹ 녹화 종료</button>
        </div>
        {videoUrl && (
          <div style={{ marginTop: 16 }}>
            <video src={videoUrl} controls width="480" />
            <a href={videoUrl} download="recorded.mp4">🎬 영상 다운로드</a>
          </div>
        )}
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>📤 영상 업로드</h2>
        <input type="file" accept="video/mp4" onChange={(e) => setUploadedFile(e.target.files?.[0] || null)} />
        <button onClick={handleUpload} style={{ marginLeft: 12 }}>🚀 업로드</button>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>🌀 3D 영상 생성</h2>
        <button onClick={handleGenerate3D}>유니티로 전송</button>
      </section>

      {message && <p style={{ marginTop: 24, color: '#444' }}>{message}</p>}
    </div>
  );
}
