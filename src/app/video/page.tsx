'use client'

import { useState } from 'react';

export default function VideoControlPage() {
  const FASTAPI_URL = 'http://192.168.0.89:8000';
  const [cmd, setCmd] = useState('default');
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const handleStart = async () => {
    try {
      const res = await fetch(`${FASTAPI_URL}/start?cmd=${cmd}`, {
        method: 'POST',
      });
      const data = await res.json();
      setStatus(data.message);
    } catch (error) {
      setStatus(`녹화 시작 실패: ${error}`);
    }
  };

  const handleStop = async () => {
    try {
      const res = await fetch(`${FASTAPI_URL}/stop`, {
        method: 'POST',
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setVideoBlobUrl(url);
      setStatus('녹화 종료, 비디오 표시됨');
    } catch (error) {
      setStatus(`녹화 종료 실패: ${error}`);
    }
  };

  const handleGetJson = async () => {
    try {
      const res = await fetch(`${FASTAPI_URL}/sendfile`, {
        method: 'POST',
      });
      const data = await res.json();
      setJsonData(data);
    } catch (error) {
      setStatus(`JSON 가져오기 실패: ${error}`);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      const res = await fetch(`${FASTAPI_URL}/upload_video`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setStatus(data.message);
    } catch (error) {
      setStatus(`업로드 실패: ${error}`);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>🎥 웹캠 녹화 컨트롤</h1>

      <input
        type="text"
        value={cmd}
        onChange={(e) => setCmd(e.target.value)}
        placeholder="명령어 입력 (interview 등)"
        style={{ padding: 8, width: 300, marginBottom: 12 }}
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <button onClick={handleStart}>▶️ 녹화 시작</button>
        <button onClick={handleStop}>⏹ 녹화 종료</button>
        <button onClick={handleGetJson}>📄 최근 JSON 보기</button>
      </div>

      {status && <p>{status}</p>}

      {videoBlobUrl && (
        <div>
          <h2>📹 최근 녹화한 영상</h2>
          <video controls src={videoBlobUrl} width="600" />
          <a href={videoBlobUrl} download="recent_video.mp4">
            🎬 비디오 다운로드
          </a>
        </div>
      )}

      {jsonData && (
        <div>
          <h2>📄 최근 JSON 데이터</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 12 }}>
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>
      )}

      <hr style={{ margin: '24px 0' }} />

      <h2>📤 영상 업로드</h2>
      <input type="file" accept="video/mp4" onChange={(e) => {
        if (e.target.files?.[0]) setUploadFile(e.target.files[0]);
      }} />
      <button onClick={handleUpload} style={{ marginLeft: 8 }}>🚀 서버로 업로드</button>
    </div>
  );
}
