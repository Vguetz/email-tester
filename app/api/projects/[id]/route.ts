import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

const MAX_NAME_LENGTH = 200;
const MAX_CODE_LENGTH = 300_000;

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
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
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  return NextResponse.json({ project: data });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const update: Record<string, string> = {};
  if (typeof body.name === 'string') {
    if (body.name.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: 'Nombre demasiado largo' }, { status: 413 });
    }
    update.name = body.name;
  }
  if (typeof body.html === 'string') {
    if (body.html.length > MAX_CODE_LENGTH) {
      return NextResponse.json({ error: 'HTML demasiado grande' }, { status: 413 });
    }
    update.html = body.html;
  }
  if (typeof body.css === 'string') {
    if (body.css.length > MAX_CODE_LENGTH) {
      return NextResponse.json({ error: 'CSS demasiado grande' }, { status: 413 });
    }
    update.css = body.css;
  }
  if (typeof body.targetClient === 'string') {
    update.target_client = body.targetClient;
  }

  const { data, error } = await supabase
    .from('projects')
    .update(update)
    .eq('id', id)
    .eq('owner_id', user.id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
