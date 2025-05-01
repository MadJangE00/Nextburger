// src/app/api/user_videos/update-result/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { json_filename, ai_video_url } = await req.json();

    if (!json_filename || !ai_video_url) {
      return NextResponse.json({ error: 'json_filename과 ai_video_url은 필수입니다.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_videos')
      .update({
        status: 'completed',
        ai_video_url,
        ai_video_ready_at: new Date().toISOString(),
      })
      .eq('json_filename', json_filename);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: '✅ 영상 생성 결과가 성공적으로 반영되었습니다.' });
  } catch (err: any) {
    console.error('[update-result] 서버 오류:', err);
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 });
  }
}
