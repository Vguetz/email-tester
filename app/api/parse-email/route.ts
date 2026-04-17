import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import juice from 'juice';
import { CompatibilityIssue, EmailPayload } from '@/app/utils/interfaces';

export async function POST(request: Request) {
  try {
    const body: EmailPayload = await request.json();
    const { html, css, targetClient } = body;

    // Inicializamos el array donde recolectaremos los problemas
    const issues: CompatibilityIssue[] = [];

    let rawHtml = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    let processedHtml = rawHtml;

    if (targetClient === 'gmail') {
      processedHtml = juice(rawHtml);
      const $ = cheerio.load(processedHtml);
      
      $('style').remove();

      $('*').each((_, element) => {
        let styleAttr = $(element).attr('style');
        if (styleAttr) {
          // 1. DETECCIÓN (Antes de borrar)
          // Usamos match para atrapar exactamente qué escribió el usuario
          const positionMatch = styleAttr.match(/position:\s*(absolute|fixed|relative)/i);
          if (positionMatch) {
            issues.push({
              property: 'position',
              value: positionMatch[1],
              message: 'Gmail ignora posiciones absolutas o relativas. Usá márgenes, padding o tablas para ubicar elementos.',
              severity: 'error' // Error porque rompe la estructura
            });
          }

          // 2. MUTILACIÓN
          styleAttr = styleAttr.replace(/position:\s*(absolute|fixed|relative)\s*;?/gi, '');
          $(element).attr('style', styleAttr.trim());
        }
      });
      processedHtml = $.html();
    } 
    
    // --- MOTOR DE OUTLOOK ---
    else if (targetClient === 'outlook') {
      processedHtml = juice(rawHtml);
      const $ = cheerio.load(processedHtml);

      $('*').each((_, element) => {
        let styleAttr = $(element).attr('style');
        
        if (styleAttr) {
          // 1. DETECCIÓN MULTIPLE
          const displayMatch = styleAttr.match(/display:\s*(flex|grid|inline-flex)/i);
          if (displayMatch) {
            issues.push({
              property: 'display',
              value: displayMatch[1],
              message: 'Outlook usa el motor de Word y no soporta Flexbox ni Grid. Estructurá tu layout usando etiquetas <table>.',
              severity: 'error'
            });
          }

          // Para border-radius solo comprobamos si existe, el valor exacto no importa tanto
          if (/border-radius/i.test(styleAttr)) {
            issues.push({
              property: 'border-radius',
              value: 'N/A',
              message: 'Outlook no puede dibujar bordes redondeados. Los botones se verán cuadrados.',
              severity: 'warning' // Warning porque el diseño se ve feo, pero no se rompe la lectura
            });
          }

          const positionMatch = styleAttr.match(/position:\s*(absolute|fixed|relative)/i);
          if (positionMatch) {
             issues.push({
              property: 'position',
              value: positionMatch[1],
              message: 'Outlook ignora el posicionamiento moderno.',
              severity: 'error'
            });
          }

          // 2. MUTILACIÓN AGRESIVA
          styleAttr = styleAttr.replace(/display:\s*(flex|grid|inline-flex)\s*;?/gi, '');
          styleAttr = styleAttr.replace(/border-radius:[^;]+;?/gi, '');
          styleAttr = styleAttr.replace(/box-shadow:[^;]+;?/gi, '');
          styleAttr = styleAttr.replace(/filter:[^;]+;?/gi, '');
          styleAttr = styleAttr.replace(/transform:[^;]+;?/gi, '');
          styleAttr = styleAttr.replace(/position:[^;]+;?/gi, '');

          $(element).attr('style', styleAttr.trim());
        }
      });

      processedHtml = $.html();
    }

    // Retornamos el HTML y nuestro array de problemas detectados
    return NextResponse.json({ success: true, processedHtml, issues });

  } catch (error) {
    console.error('Error procesando el correo:', error);
    return NextResponse.json(
      { success: false, error: 'Fallo al procesar el código' },
      { status: 500 }
    );
  }
}