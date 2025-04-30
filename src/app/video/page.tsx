'use client';

import { useState } from 'react';

export default function RecordPage() {
  const [cmd, setCmd] = useState('default');
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
  const UNITY_URL = 'http://192.168.1.177:5001';

  const handleStart = async () => {
    try {
      const res = await fetch(`${FASTAPI_URL}/start?cmd=${cmd}`, { method: 'POST' });
      const data = await res.json();
      alert(data.message || '녹화 시작됨');
    } catch (e) {
      alert('녹화 시작 실패');
    }
  };

  const handleStop = async () => {
    try {
      const res = await fetch(`${FASTAPI_URL}/stop`, { method: 'POST' });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setVideoBlobUrl(url);

      // JSON → Unity 전송
      const jsonRes = await fetch(`${FASTAPI_URL}/sendfile`, { method: 'POST' });
      const jsonData = await jsonRes.json();

      await fetch(UNITY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
      });

      alert('녹화 종료 + Unity로 전송 완료');
    } catch (e) {
      alert('녹화 종료 실패');
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
      alert(data.message || '업로드 완료');
    } catch (e) {
      alert('업로드 실패');
    }
  };

  const handle3DVideo = async () => {
    try {
      const res = await fetch(`${FASTAPI_URL}/get_latest_json`, { method: 'POST' });
      const jsonData = await res.json();

      await fetch(UNITY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
      });

      alert('Unity로 전송 완료');
    } catch (e) {
      alert('Unity 전송 실패');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎥 웹캠 녹화/업로드</h1>

      <input
        className="border p-2 w-full mb-4"
        placeholder="명령어를 입력하세요 (예: interview, test)"
        value={cmd}
        onChange={(e) => setCmd(e.target.value)}
      />

      <div className="flex gap-2 mb-4">
        <button onClick={handleStart} className="bg-green-500 px-4 py-2 text-white rounded">▶️ 녹화 시작</button>
        <button onClick={handleStop} className="bg-red-500 px-4 py-2 text-white rounded">⏹ 녹화 종료</button>
      </div>

      {videoBlobUrl && (
        <div className="mb-4">
          <h2 className="font-bold">📹 최근 녹화한 영상</h2>
          <video controls src={videoBlobUrl} className="w-full mt-2" />
          <a href={videoBlobUrl} download="recent_video.mp4" className="text-blue-500 mt-2 inline-block">🎬 다운로드</a>
        </div>
      )}

      <h2 className="font-bold mt-6">📤 영상 업로드</h2>
      <input
        type="file"
        accept="video/mp4"
        className="mb-2"
        onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} className="bg-blue-500 px-4 py-2 text-white rounded">🚀 서버로 업로드</button>

      <div className="mt-6">
        <button onClick={handle3DVideo} className="bg-purple-600 px-4 py-2 text-white rounded">🌀 업로드 기반 3D 영상 만들기</button>
      </div>
    </div>
  );
}
