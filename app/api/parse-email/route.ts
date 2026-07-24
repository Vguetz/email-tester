import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import juice from 'juice';
import { CompatibilityIssue, EmailPayload, TargetClient, CLIENT_LABELS } from '@/app/utils/interfaces';
import { evaluateStyle, shouldStripHeadStyle } from '@/app/utils/rulesEngine';
import { createClient } from '@/app/utils/supabase/server';

const MAX_PAYLOAD_LENGTH = 300_000;
const VALID_CLIENTS = new Set(Object.keys(CLIENT_LABELS));

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 });
  }

  try {
    const body: EmailPayload = await request.json();
    const { html, css, targetClient } = body;

    if (typeof html !== 'string' || typeof css !== 'string') {
      return NextResponse.json({ success: false, error: 'Payload inválido' }, { status: 400 });
    }
    if (html.length + css.length > MAX_PAYLOAD_LENGTH) {
      return NextResponse.json({ success: false, error: 'El código es demasiado grande' }, { status: 413 });
    }
    if (!VALID_CLIENTS.has(targetClient)) {
      return NextResponse.json({ success: false, error: 'Cliente de correo no soportado' }, { status: 400 });
    }
    const client = targetClient as TargetClient;

    const issues: CompatibilityIssue[] = [];

    const rawHtml = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    const inlined = juice(rawHtml);
    const $ = cheerio.load(inlined);

    if (shouldStripHeadStyle(client)) {
      $('style').remove();
    }

    $('*').each((_, element) => {
      const styleAttr = $(element).attr('style');
      if (!styleAttr) return;

      const { cleanedStyle, issues: elementIssues } = evaluateStyle(styleAttr, client);
      issues.push(...elementIssues);

      if (cleanedStyle) {
        $(element).attr('style', cleanedStyle);
      } else {
        $(element).removeAttr('style');
      }
    });

    const processedHtml = $.html();

    return NextResponse.json({ success: true, processedHtml, issues });
  } catch (error) {
    console.error('Error procesando el correo:', error);
    return NextResponse.json(
      { success: false, error: 'Fallo al procesar el código' },
      { status: 500 }
    );
  }
}
