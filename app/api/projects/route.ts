import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

const MAX_NAME_LENGTH = 200;
const MAX_CODE_LENGTH = 300_000; // matches the payload cap on /api/parse-email

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.html !== 'string' || typeof body.css !== 'string') {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : 'Untitled project';
  if (name.length > MAX_NAME_LENGTH || body.html.length > MAX_CODE_LENGTH || body.css.length > MAX_CODE_LENGTH) {
    return NextResponse.json({ error: 'Payload demasiado grande' }, { status: 413 });
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      owner_id: user.id,
      name,
      html: body.html,
      css: body.css,
      target_client: typeof body.targetClient === 'string' ? body.targetClient : 'gmail',
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data }, { status: 201 });
}
