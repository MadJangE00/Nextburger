// components/VideoLogTable.tsx
'use client';

import React from 'react';

type Video = {
  id: string;
  uploaded_at: string;
  status: string;
  json_filename: string | null;
  ai_video_url: string | null;
};

type Props = {
  videos: Video[];
};

export default function VideoLogTable({ videos }: Props) {
  if (!videos || videos.length === 0) {
    return <p style={{ marginTop: 24 }}>아직 생성한 영상이 없습니다.</p>;
  }

  return (
    <table border={1} cellPadding={8} style={{ marginTop: 32, width: '100%' }}>
      <thead>
        <tr>
          <th>UUID</th>
          <th>업로드 시각</th>
          <th>상태</th>
          <th>Landmark JSON</th>
          <th>AI 영상</th>
        </tr>
      </thead>
      <tbody>
        {videos.map((video) => (
          <tr key={video.id}>
            <td>{video.id}</td>
            <td>{new Date(video.uploaded_at).toLocaleString()}</td>
            <td>
              {video.status === 'completed' && '🟢 완료'}
              {video.status === 'processing' && '🟡 처리 중'}
              {video.status === 'failed' && '🔴 실패'}
            </td>
            <td>{video.json_filename || '-'}</td>
            <td>
              {video.ai_video_url ? (
                <a href={video.ai_video_url} target="_blank" rel="noreferrer">
                  보기
                </a>
              ) : (
                '⏳ 생성 중'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
