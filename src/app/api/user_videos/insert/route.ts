// src/app/api/user_videos/insert/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { video_url, json_filename } = await req.json();
    const authHeader = req.headers.get('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    console.log('👉 Authorization header:', authHeader);

    if (!accessToken) {
      return NextResponse.json({ error: '토큰이 없습니다.' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log('👉 Supabase user:', user);

    if (authError || !user) {
      return NextResponse.json({ error: '유저 인증 실패' }, { status: 403 });
    }

    const payload = {
      user_id: user.id,
      video_url,
      json_filename,
      status: 'processing',
      uploaded_at: new Date().toISOString(),
    };

    console.log('👉 INSERT payload:', payload);

    const { error } = await supabase.from('user_videos').insert(payload);

    if (error) {
      console.error('❌ Supabase INSERT error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: '✅ 업로드 기록 성공' });
  } catch (err: any) {
    console.error('[insert-user-video] 서버 오류:', err.message);
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 });
  }
}
