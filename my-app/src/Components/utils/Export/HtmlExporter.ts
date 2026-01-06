import { DroppedBlock } from '../../../Store/Slice/workspaceSlice';
import { widgetToHTML } from './widgetRenderers';

export interface HtmlExportOptions {
  minify?: boolean;
  templateName?: string;
  templateDescription?: string;
  generateIds?: boolean;
  inlineStyles?: boolean;
  responsive?: boolean;
}

export function exportToHTML(blocks: DroppedBlock[], options: HtmlExportOptions = {}): string {
  const opts: Required<HtmlExportOptions> = {
    minify: false,
    templateName: 'Email Template',
    templateDescription: '',
    generateIds: true,
    inlineStyles: true,
    responsive: true,
    ...options
  };

  // Process blocks
  const processedBlocks = blocks.map(block => processBlockForExport(block, opts));

  // Generate HTML content
  const htmlContent = processedBlocks.map(block => blockToHTML(block)).join('\n');

  // Wrap in complete HTML document
  const fullHtml = wrapInHtmlDocument(htmlContent, opts);

  return opts.minify ? minifyHtml(fullHtml) : fullHtml;
}

// ========== CORE HTML GENERATION ==========
function blockToHTML(block: any): string {
  const blockStyle = getBlockStyle(block.style);

  let html = `<table class="email-block" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${blockStyle}">
    <tr>
      <td align="center">`;

  // Handle columns
  if (block.columns?.length > 0) {
    const colCount = block.columns.length;
    const columnWidth = Math.floor(100 / colCount); // Use whole number for better compatibility

    html += `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="table-layout: fixed; border-collapse: collapse;">
      <tr>`;

    block.columns.forEach((column: any) => {
      const colStyle = getColumnStyle(column.style);
      html += `
        <td class="email-column" width="${columnWidth}%" valign="top" style="${colStyle}; width: ${columnWidth}%; box-sizing: border-box;">`;

      // Add widgets
      column.widgetContents?.forEach((widget: any) => {
        html += widgetToHTML(widget);
      });

      html += `</td>`;
    });

    html += `</tr></table>`;
  }

  html += `</td></tr></table>`;
  return html;
}

// ========== STYLE HELPERS ==========
function getBlockStyle(style: any): string {
  if (!style) return '';

  const styles = [
    `background-color: ${style.bgColor || '#ffffff'}`,
    `padding: ${style.padding?.top || 0}px ${style.padding?.right || 0}px ${style.padding?.bottom || 0}px ${style.padding?.left || 0}px`,
    style.borderTopSize > 0 ? `border-top: ${style.borderTopSize}px ${style.borderStyle || 'solid'} ${style.borderTopColor || 'transparent'}` : '',
    style.borderBottomSize > 0 ? `border-bottom: ${style.borderBottomSize}px ${style.borderStyle || 'solid'} ${style.borderBottomColor || 'transparent'}` : '',
    style.borderLeftSize > 0 ? `border-left: ${style.borderLeftSize}px ${style.borderStyle || 'solid'} ${style.borderLeftColor || 'transparent'}` : '',
    style.borderRightSize > 0 ? `border-right: ${style.borderRightSize}px ${style.borderStyle || 'solid'} ${style.borderRightColor || 'transparent'}` : ''
  ].filter(Boolean).join('; ');

  return styles;
}

function getColumnStyle(style: any): string {
  if (!style) return '';

  const styles = [
    `background-color: ${style.bgColor || 'transparent'}`,
    `padding: ${style.padding?.top || 0}px ${style.padding?.right || 0}px ${style.padding?.bottom || 0}px ${style.padding?.left || 0}px`,
    style.borderTopSize > 0 ? `border-top: ${style.borderTopSize}px ${style.borderStyle || 'solid'} ${style.borderTopColor || 'transparent'}` : '',
    style.borderBottomSize > 0 ? `border-bottom: ${style.borderBottomSize}px ${style.borderStyle || 'solid'} ${style.borderBottomColor || 'transparent'}` : '',
    style.borderLeftSize > 0 ? `border-left: ${style.borderLeftSize}px ${style.borderStyle || 'solid'} ${style.borderLeftColor || 'transparent'}` : '',
    style.borderRightSize > 0 ? `border-right: ${style.borderRightSize}px ${style.borderStyle || 'solid'} ${style.borderRightColor || 'transparent'}` : '',
    `vertical-align: top`
  ].filter(Boolean).join('; ');

  return styles;
}

// ========== PROCESSING ==========
function processBlockForExport(block: DroppedBlock, options: Required<HtmlExportOptions>): any {
  return {
    ...block,
    id: options.generateIds && !block.id ? generateId('block') : block.id,
    columns: block.columns.map(column => ({
      ...column,
      id: options.generateIds && !column.id ? generateId('col') : column.id,
      widgetContents: column.widgetContents.map(widget => ({
        ...widget,
        widgetId: options.generateIds ? generateId('widget') : undefined,
        contentData: parseContentData(widget.contentData)
      }))
    }))
  };
}

// ========== HTML DOCUMENT WRAPPER ==========
function wrapInHtmlDocument(content: string, options: Required<HtmlExportOptions>): string {
  const safeTemplateName = escapeHtml(options.templateName);
  const safeDescription = options.templateDescription ? escapeHtml(options.templateDescription) : '';

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${safeTemplateName}</title>
    <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <!-- Load Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style type="text/css">
        /* RESET STYLES */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; line-height: 100%; outline: none; text-decoration: none; display: block; }
        
        body { margin: 0; padding: 0; width: 100% !important; background-color: #f5f5f5; }
        html { width: 100% !important; }
        
        /* HELPER CLASSES */
        .email-container { width: 100% !important; max-width: 600px !important; margin: 0 auto !important; }
        
        /* MEDIA QUERIES */
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .email-column { display: block !important; width: 100% !important; padding-right: 0 !important; padding-left: 0 !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
    
    <!--[if mso]>
    <table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="600">
    <tr>
    <td align="center" valign="top">
    <![endif]-->
    
    <div class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        ${content}
        
        <!-- Footer Info (Optional) -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-top: 1px solid #dee2e6;">
            <tr>
                <td style="padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 12px; color: #6c757d;">
                    ${safeDescription ? `<p style="margin: 0 0 10px 0;">${safeDescription}</p>` : ''}
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${safeTemplateName}. All rights reserved.</p>
                </td>
            </tr>
        </table>
    </div>
    
    <!--[if mso]>
    </td>
    </tr>
    </table>
    <![endif]-->
    
</body>
</html>`;
}

// ========== UTILITY FUNCTIONS ==========
function parseContentData(contentData: string | null): any {
  if (!contentData) return null;
  try {
    return JSON.parse(contentData);
  } catch {
    return contentData;
  }
}

function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Safer escape function without DOM dependency
function escapeHtml(text: any): string {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function minifyHtml(html: string): string {
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
}