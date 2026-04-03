import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  if (code) {
    try {
      const supabase = createSupabaseServerClient();
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Supabase OAuth callback error:', error);
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
