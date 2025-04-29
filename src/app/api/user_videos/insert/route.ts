// src/app/api/user_videos/insert/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 서버 전용 Supabase 클라이언트 (service_role_key 사용)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: '유저 인증 실패' }, { status: 401 });
    }

    const body = await req.json();
    const { json_filename } = body;

    const { error: insertError } = await supabase.from('user_videos').insert({
      user_id: user.id,
      status: 'processing',
      json_filename: json_filename || null,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: '🎬 영상 작업이 등록되었습니다.' });
  } catch (error: any) {
    console.error('Insert Error:', error.message);
    return NextResponse.json({ error: '서버 에러 발생' }, { status: 500 });
  }
}
