'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VideoPage() {
  const router = useRouter();
  const [cmd, setCmd] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const FASTAPI_URL = 'http://localhost:8000';

  const handleStartRecording = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${FASTAPI_URL}/start?cmd=${cmd}`, { method: 'POST' });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage('녹화 시작 실패');
    }
    setLoading(false);
  };

  const handleStopRecording = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${FASTAPI_URL}/stop`, { method: 'POST' });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setMessage('녹화 종료 완료');
    } catch (err) {
      setMessage('녹화 종료 실패');
    }
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;
    setLoading(true);
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
    setLoading(false);
  };

  const handleGenerate3D = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${FASTAPI_URL}/get_latest_json`, { method: 'POST' });
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
    setLoading(false);
  };

  const handlePlayLatestVideo = async () => {
    try {
      const res = await fetch(`${FASTAPI_URL}/get_latest_video`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setMessage('🎬 최신 영상 불러오기 완료');
      } else {
        setMessage('❌ 업로드된 영상이 없습니다.');
      }
    } catch (err) {
      setMessage('❌ 영상 불러오기 실패');
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24, fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: 28 }}>🎥 3D 영상 제작 플랫폼</h1>
      <p style={{ color: '#555' }}>웹캠 녹화 또는 영상 업로드를 통해 3D 콘텐츠를 생성하고 유니티로 전송하세요.</p>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 20 }}>📷 웹캠 촬영</h2>
        <input
          type="text"
          placeholder="파일명을 입력하세요"
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          style={{ padding: 8, width: '100%', marginBottom: 8 }}
        />
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleStartRecording} disabled={loading}>▶️ 녹화 시작</button>
          <button onClick={handleStopRecording} disabled={loading}>⏹ 녹화 종료</button>
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20 }}>📤 영상 업로드</h2>
        <input type="file" accept="video/mp4" onChange={(e) => setUploadedFile(e.target.files?.[0] || null)} />
        <button onClick={handleUpload} style={{ marginLeft: 12 }} disabled={loading}>🚀 업로드</button>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20 }}>🌀 3D 영상 생성</h2>
        <button onClick={handleGenerate3D} disabled={loading}>유니티로 전송</button>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20 }}>📽 최신 영상 보기</h2>
        <button onClick={handlePlayLatestVideo}>📺 영상 재생</button>
      </section>

      {videoUrl && (
        <div style={{ marginTop: 20 }}>
          <video src={videoUrl} controls width="100%" />
          <a href={videoUrl} download="recorded.mp4" style={{ display: 'block', marginTop: 8 }}>
            🎬 영상 다운로드
          </a>
        </div>
      )}

      {message && <p style={{ marginTop: 24, color: '#444' }}>{message}</p>}
    </div>
  );
}
